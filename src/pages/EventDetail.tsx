import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { getEvent } from "../api/events";
import {
  checkUserInterested,
  getInterestedCount,
  listInterestedUsers,
  toggleInterest,
} from "../api/interests";
import { formatEventDatePt } from "../utils/datetime";
import { toastError, toastSuccess } from "../utils/toast";
import { getErrorMessage } from "../errors";
import PeopleTable from "../components/PeopleTable";
import type { Event } from "../types/event";
import type { User } from "../types";
import { isAbortError } from "../utils/http";

export default function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const eventId = Number(id);
  const { user } = useAuth();

  const [event, setEvent] = useState<Event | null>(null);
  const [interestedCount, setInterestedCount] = useState<number>(0);
  const [interestedUsers, setInterestedUsers] = useState<User[]>([]);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!eventId) return;
    const ctrl = new AbortController();

    (async () => {
      try {
        const ev = await getEvent(eventId, ctrl.signal);
        setEvent(ev);

        const [count, users] = await Promise.all([
          getInterestedCount(eventId, ctrl.signal),
          listInterestedUsers(eventId, ctrl.signal),
        ]);
        setInterestedCount(count);
        setInterestedUsers(users);

        if (user?.id) {
          const going = await checkUserInterested(
            Number(user.id),
            eventId,
            ctrl.signal
          );
          setEvent((prev) =>
            prev ? { ...prev, interestedByMe: going } : prev
          );
        }
      } catch (e) {
        if (isAbortError(e)) return; // 👈 não mostre toast em abort
        toastError(getErrorMessage("EVENTS_LOAD", e));
      }
    })();

    return () => ctrl.abort();
  }, [eventId, user?.id]);

  const headerBg = useMemo(
    () =>
      event?.imageUrl
        ? { background: `center/cover no-repeat url(${event.imageUrl})` }
        : { background: "var(--bs-secondary-bg)" },
    [event?.imageUrl]
  );

  const toggleMyInterest = async () => {
    if (!user?.id || !event) {
      toastError("Faça login para confirmar interesse.");
      return;
    }
    try {
      setPending(true);
      const { isInterested } = await toggleInterest(Number(user.id), eventId);

      // atualiza cabeçalho (flag + contagem)
      setEvent((prev) =>
        prev ? { ...prev, interestedByMe: isInterested } : prev
      );
      setInterestedCount((c) => Math.max(0, c + (isInterested ? 1 : -1)));

      // atualiza tabela (otimista simples)
      if (isInterested) {
        const me: User = {
          id: user.id,
          fullName: user.fullName!,
          email: user.email!,
          avatarUrl: user.avatarUrl ?? null,
          bio: user.bio ?? null,
          createdAt: user.createdAt ?? null,
        } as any;
        setInterestedUsers((prev) => {
          if (prev.some((u) => String(u.id) === String(user.id))) return prev;
          return [me, ...prev];
        });
        toastSuccess("Interesse confirmado!");
      } else {
        setInterestedUsers((prev) =>
          prev.filter((u) => String(u.id) !== String(user.id))
        );
        toastSuccess("Interesse removido.");
      }
    } catch (e) {
      toastError(getErrorMessage("EVENTS_INTEREST", e));
    } finally {
      setPending(false);
    }
  };

  if (!event) return <div className="container py-5">Carregando…</div>;

  return (
    <>
      {/* Header com imagem */}
      <div style={{ ...headerBg, height: 220 }} />

      <div className="container py-4 py-md-5">
        {/* Título + metadados */}
        <h2 className="fw-bold mb-2">{event.title}</h2>
        <div className="text-body-secondary small d-flex flex-wrap gap-3 mb-3">
          <span>
            <i className="bi bi-calendar-event me-2" />
            {formatEventDatePt(event.date, event.time)}
          </span>
          <span>
            <i className="bi bi-geo-alt me-2" />
            {event.location}
          </span>
          <span>
            <i className="bi bi-people me-2" />
            {interestedCount} interessados
          </span>
        </div>

        {/* Sobre + Organizador */}
        <div className="row g-3 mb-3">
          <div className="col-12 col-lg-8">
            <div className="card shadow-sm rounded-4 border-0">
              <div className="card-body">
                <h6 className="fw-semibold mb-2">Sobre o Evento</h6>
                <p className="mb-0 text-body-secondary">
                  {event.description || "Sem descrição."}
                </p>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-4">
            <div className="card shadow-sm rounded-4 border-0">
              <div className="card-body">
                <h6 className="fw-semibold mb-2">Organizado por</h6>
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center"
                    style={{ width: 36, height: 36 }}
                  >
                    {(event.organizer?.fullName ?? "OR")
                      .split(" ")
                      .slice(0, 2)
                      .map((p) => p[0]?.toUpperCase())
                      .join("")}
                  </div>
                  <div className="small">
                    <div className="fw-semibold">
                      {event.organizer?.fullName ?? "—"}
                    </div>
                    <div className="text-body-secondary">Organizador</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Barra de interesse */}
        <div className="card bg-success-subtle border-0 rounded-4 mb-4">
          <div className="card-body d-flex justify-content-between align-items-center">
            <div className="text-success-emphasis">
              Interessado neste evento?
            </div>
            <button
              className={`btn rounded-pill px-3 ${event.interestedByMe ? "btn-success" : "btn-outline-success"}`}
              onClick={toggleMyInterest}
              disabled={pending}
            >
              {pending ? (
                <>
                  <i className="bi bi-hourglass-split me-2" /> Processando…
                </>
              ) : event.interestedByMe ? (
                <>
                  <i className="bi bi-heart-fill me-2" /> Interesse confirmado
                </>
              ) : (
                <>
                  <i className="bi bi-heart me-2" /> Confirmar interesse
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tabela de interessados */}
        <h6 className="fw-semibold mb-2">
          Pessoas Interessadas ({interestedCount})
        </h6>
        <PeopleTable users={interestedUsers} pageSize={10} />
      </div>
    </>
  );
}
