import { useEffect, useState } from "react";
import { toastError, toastSuccess } from "../utils/toast";
import { getErrorMessage } from "../errors";
import { getCurrentUser, updateUser } from "../api/users";
import { listEventsByOrganizer } from "../api/events";
import { listInterestedEventsByUser } from "../api/interests";
import ProfileAvatarCard from "../components/ProfileAvatarCard";
import ProfileStatsCard from "../components/ProfileStatsCard";
import PersonalInfoCard from "../components/PersonalInfoCard";
import type { User, UpdateUserPayload } from "../types";

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [createdCount, setCreatedCount] = useState(0);
  const [participatedCount, setParticipatedCount] = useState(0);

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

  // Busca estatísticas quando houver id
  useEffect(() => {
    if (!user?.id) return;
    const ctrl = new AbortController();

    (async () => {
      try {
        const uid = Number(user.id);
        const [created, participated] = await Promise.all([
          listEventsByOrganizer(uid, ctrl.signal),
          listInterestedEventsByUser(uid, ctrl.signal),
        ]);

        setCreatedCount(created.length);
        setParticipatedCount(participated.length);
      } catch (e) {
        toastError(getErrorMessage("UNKNOWN", e));
      }
    })();

    return () => ctrl.abort();
  }, [user?.id]);

  // Salvar alterações de perfil (nome, bio, etc.)
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

  // Atualiza o avatar localmente após upload bem-sucedido no card
  const handleAvatarUpdated = (newUrl: string | null) => {
    setUser(prev => (prev ? { ...prev, avatarUrl: newUrl ?? null } : prev));
  };

  if (loading || !user) return <div className="container py-5">Carregando…</div>;

  return (
    <div className="container py-4 py-md-5">
      <div className="row g-4">
        <div className="col-12 col-lg-4">
          <ProfileAvatarCard user={user} onAvatarUpdated={handleAvatarUpdated} />
          <div className="mt-4">
            <ProfileStatsCard
              createdCount={createdCount}
              participatedCount={participatedCount}
            />
          </div>
        </div>

        <div className="col-12 col-lg-8">
          <PersonalInfoCard user={user} onSave={handleSave} />
        </div>
      </div>
    </div>
  );
}
