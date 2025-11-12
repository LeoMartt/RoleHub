import { useEffect, useState } from "react";
import { toastError, toastSuccess } from "../utils/toast";
import { getErrorMessage } from "../errors";
import { getCurrentUser, updateUser } from "../api/users";
import { listEventsByOrganizer, deleteEvent } from "../api/events";
import { listInterestedEventsByUser } from "../api/interests";
import ProfileAvatarCard from "../components/ProfileAvatarCard";
import ProfileStatsCard from "../components/ProfileStatsCard";
import PersonalInfoCard from "../components/PersonalInfoCard";
import EventsTablePaged from "../components/EventsTablePaged";
import ConfirmModal from "../components/ConfirmModal";
import type { User, UpdateUserPayload } from "../types";
import type { Event } from "../types/event";

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [createdEvents, setCreatedEvents] = useState<Event[]>([]);
  const [interestedEvents, setInterestedEvents] = useState<Event[]>([]);

  // modal de confirmação para excluir
  const [deleteTarget, setDeleteTarget] = useState<Event | null>(null);
  const [deleting, setDeleting] = useState(false);

  // pendência para “remover interesse”
  const [uninterestIds, setUninterestIds] = useState<Set<number>>(new Set());

  // Carrega usuário logado
  useEffect(() => {
    (async () => {
      try {
        const data = await getCurrentUser();
        setUser(data);
      } catch (e) {
        toastError(getErrorMessage("UNKNOWN", e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Busca eventos (criador + com interesse) quando houver id
  useEffect(() => {
    if (!user?.id) return;
    const ctrl = new AbortController();

    (async () => {
      try {
        const uid = Number(user.id);
        const [mine, interested] = await Promise.all([
          listEventsByOrganizer(uid, ctrl.signal),
          listInterestedEventsByUser(uid, ctrl.signal),
        ]);
        setCreatedEvents(mine);
        setInterestedEvents(interested);
      } catch (e) {
        toastError(getErrorMessage("UNKNOWN", e));
      }
    })();

    return () => ctrl.abort();
  }, [user?.id]);

  // Salvar alterações de perfil
  const handleSave = async (patch: UpdateUserPayload) => {
    if (!user) return;
    try {
      const updated = await updateUser(Number(user.id), patch);
      setUser(updated);
      toastSuccess("Perfil atualizado!");
    } catch (e) {
      toastError(getErrorMessage("UNKNOWN", e));
    }
  };

  // Atualiza o avatar localmente após upload
  const handleAvatarUpdated = (newUrl: string | null) => {
    setUser((prev) => (prev ? { ...prev, avatarUrl: newUrl ?? null } : prev));
  };

  // Abrir modal ao clicar em “Excluir” (sem confirmar do navegador)
  const requestDeleteEvent = (ev: Event) => setDeleteTarget(ev);

  // Confirmar exclusão no modal
  const confirmDelete = async () => {
    if (!deleteTarget || !user?.id) return;
    setDeleting(true);
    try {
      // use a assinatura que você já tem no client (com organizerId, se aplicável)
      await deleteEvent(deleteTarget.id, Number(user.id));
      setCreatedEvents((prev) => prev.filter((e) => e.id !== deleteTarget.id));
      toastSuccess("Evento excluído com sucesso.");
      setDeleteTarget(null);
    } catch (e) {
      toastError(getErrorMessage("UNKNOWN", e));
    } finally {
      setDeleting(false);
    }
  };

  // Remover interesse (tabela "Eventos com meu interesse")
  const onRemoveInterest = async (ev: Event) => {
    if (!user?.id) return;

    setUninterestIds((prev) => new Set(prev).add(ev.id));
    try {
      const { toggleInterest } = await import("../api/interests");
      const res = await toggleInterest(Number(user.id), ev.id);
      if (res.isInterested === false) {
        setInterestedEvents((prev) => prev.filter((e) => e.id !== ev.id));
        toastSuccess("Interesse removido.");
      } else {
        toastError("Não foi possível remover o interesse agora.");
      }
    } catch (e) {
      toastError(getErrorMessage("EVENTS_INTEREST", e));
    } finally {
      setUninterestIds((prev) => {
        const next = new Set(prev);
        next.delete(ev.id);
        return next;
      });
    }
  };

  if (loading || !user) return <div className="container py-5">Carregando…</div>;

  const createdCount = createdEvents.length;
  const participatedCount = interestedEvents.length;

  return (
    <div className="container py-4 py-md-5">
      <div className="row g-4">
        {/* Esquerda: avatar + estatísticas */}
        <div className="col-12 col-lg-4">
          <ProfileAvatarCard user={user} onAvatarUpdated={handleAvatarUpdated} />
          <div className="mt-4">
            <ProfileStatsCard
              createdCount={createdCount}
              participatedCount={participatedCount}
            />
          </div>
        </div>

        {/* Direita: informações pessoais */}
        <div className="col-12 col-lg-8">
          <PersonalInfoCard user={user} onSave={handleSave} />
        </div>
      </div>

      {/* Tabelas mais abaixo e ocupando espaço */}
      <div className="row g-4 mt-5">
        <div className="col-12 col-xl-6">
          <EventsTablePaged
            title="Meus eventos (organizador)"
            events={createdEvents}
            emptyMessage="Você ainda não criou eventos."
            pageSize={10}
            action={{
              label: "Excluir",
              variant: "outline-danger",
              onClick: requestDeleteEvent, // abre modal
              title: "Excluir evento",
            }}
          />
        </div>

        <div className="col-12 col-xl-6">
          <EventsTablePaged
            title="Eventos que tenho interesse"
            events={interestedEvents}
            emptyMessage="Você ainda não demonstrou interesse em eventos."
            pageSize={10}
            action={{
              label: "Remover interesse",
              variant: "outline-secondary",
              onClick: onRemoveInterest,
              isBusy: (id) => uninterestIds.has(id),
              title: "Remover meu interesse",
            }}
          />
        </div>
      </div>

      {/* Modal de confirmação para exclusão */}
      <ConfirmModal
        open={!!deleteTarget}
        title="Excluir evento"
        message={
          <>
            Tem certeza que deseja excluir o evento{" "}
            <strong>{deleteTarget?.title}</strong>?<br />
            Esta ação <u>não pode ser desfeita</u>.
          </>
        }
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        onConfirm={confirmDelete}
        onClose={() => (!deleting ? setDeleteTarget(null) : undefined)}
        busy={deleting}
      />
    </div>
  );
}
