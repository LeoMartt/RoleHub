import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import CreateEventButton from "../components/CreateEventButton";
import EventCard from "../components/EventCard";
import EventsFilter from "../components/EventsFilter";
import StatsBar from "../components/StatsBar";
import { getErrorMessage } from "../errors";
import { useEvents } from "../hooks/useEvents";
import type { eventsLocalization } from "../types/event";
import { matchesDateQuery } from "../utils/datetime";
import { handleToggleInterest } from "../utils/interest";
import { normalize } from "../utils/text";
import { toastError, toastSuccess } from "../utils/toast";
import { listInterestedEventsByUser } from "../api/interests";
import { isAbortError } from "../utils/http";

export default function Home() {
  const { user } = useAuth();
  const { events, isLoading, error, setEvents, reload } = useEvents();

  const [search, setSearch] = useState("");
  const [dateQuery, setDateQuery] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    if (error) toastError(error);
  }, [error]);

  const locationOptions = useMemo<eventsLocalization[]>(() => {
    const set = new Set<string>();
    for (const e of events) {
      const loc = (e.location ?? "").trim();
      if (loc) set.add(loc);
    }
    return Array.from(set)
      .sort((a, b) => a.localeCompare(b))
      .map((l) => ({ location: l }));
  }, [events]);

  // aplica filtros
  const filteredEvents = useMemo(() => {
    const s = normalize(search);
    return events.filter((e) => {
      const byTitle = normalize(e.title).includes(s);
      const byDate = matchesDateQuery(e.date, dateQuery);
      const byLoc = !location || e.location === location;
      return byTitle && byDate && byLoc;
    });
  }, [events, search, dateQuery, location]);

  // hidrata interestedByMe depois que a lista de eventos carrega
  useEffect(() => {
    if (!user?.id || !events.length) return;
    const ctrl = new AbortController();

    (async () => {
      try {
        const mine = await listInterestedEventsByUser(Number(user.id), ctrl.signal);
        const ids = new Set(mine.map((e) => e.id));
        setEvents((prev) => {
          let changed = false;
          const next = prev.map((ev) => {
            const flag = ids.has(ev.id);
            if ((ev.interestedByMe ?? false) !== flag) {
              changed = true;
              return { ...ev, interestedByMe: flag };
            }
            return ev;
          });
          return changed ? next : prev;
        });
      } catch (e) {
        if (!isAbortError(e)) console.error(e);
      }
    })();

    return () => ctrl.abort();
  }, [user?.id, events.length, setEvents]);

  // interested (toggle)
  const [pending, setPending] = useState<Set<number>>(new Set());
  const onInterested = useCallback(
    async (id: number) => {
      if (!user?.id) {
        toastError("Faça login para marcar interesse.");
        return;
      }

      setPending((prev) => new Set(prev).add(id));
      try {
        await handleToggleInterest(id, Number(user.id), setEvents);
        toastSuccess("Interesse atualizado!");
      } catch (e) {
        toastError(getErrorMessage("EVENTS_INTEREST", e));
      } finally {
        setPending((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }
    },
    [user?.id, setEvents]
  );

  if (isLoading) return <div className="container py-5">Carregando…</div>;

  return (
    <>
      <section className="hero-full">
        <div className="hero-bg" />
        <div className="container hero-content text-center">
          <h1 className="display-4 fw-bold text-white">RolêHub</h1>
          <p className="lead text-white-50 mb-5">
            Descubra eventos incríveis na sua região e conecte-se com a comunidade
            local
          </p>
          <CreateEventButton onCreated={reload} />
        </div>
      </section>

      <StatsBar events={events} />

      <div className="container py-4">
        <h2 className="mb-3 fw-semibold">Eventos Disponíveis</h2>

        <EventsFilter
          search={search}
          onSearch={setSearch}
          dateQuery={dateQuery}
          onDateQuery={setDateQuery}
          location={location}
          onLocation={setLocation}
          locations={locationOptions}
        />

        <div className="row g-4">
          {filteredEvents.map((ev) => (
            <div className="col-12 col-md-6 col-lg-4" key={ev.id}>
              <EventCard
                event={ev}
                onInterested={onInterested}
                disabled={pending.has(ev.id)}
              />
            </div>
          ))}
          {filteredEvents.length === 0 && (
            <div className="text-center text-body-secondary py-5">
              Nenhum evento encontrado com os filtros informados.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
