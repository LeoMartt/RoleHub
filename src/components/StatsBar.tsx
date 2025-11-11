// src/components/StatsBar.tsx
import { useEffect, useMemo, useState } from "react";
import type { Event } from "../types/event";
import { getUsersCount } from "../utils/users";

type Props = {
  events: Event[];
};

function formatNum(n: number | null | undefined) {
  if (n == null) return "—";
  return new Intl.NumberFormat("pt-BR").format(n);
}

export default function StatsBar({ events }: Props) {
  const [userCount, setUserCount] = useState<number | null>(null);

  const eventCount = events.length;

  const locationCount = useMemo(() => {
    const set = new Set<string>();
    for (const e of events) {
      const loc = (e.location ?? "").trim();
      if (loc) set.add(loc);
    }
    return set.size;
  }, [events]);

  // busca contagem de usuários
  useEffect(() => {
    const ctrl = new AbortController();
    getUsersCount(ctrl.signal)
      .then((count) => setUserCount(count))
      .catch(() => setUserCount(null));
    return () => ctrl.abort();
  }, []);

  return (
    <section className="py-2">
      <div className="container mt-3">
        <div className="row text-center g-4 justify-content-center">

          {/* Eventos */}
          <div className="col-12 col-md-4">
            <i className="bi bi-calendar3 text-success display-5 d-block mb-2" />
            <div className="fs-2 fw-bold">{formatNum(eventCount)}</div>
            <div className="text-body-secondary">Eventos</div>
          </div>

          {/* Usuários */}
          <div className="col-12 col-md-4">
            <i className="bi bi-people text-success display-5 d-block mb-2" />
            <div className="fs-2 fw-bold">{formatNum(userCount)}</div>
            <div className="text-body-secondary">Participantes</div>
          </div>

          {/* Localizações */}
          <div className="col-12 col-md-4">
            <i className="bi bi-geo-alt text-success display-5 d-block mb-2" />
            <div className="fs-2 fw-bold">{formatNum(locationCount)}</div>
            <div className="text-body-secondary">Localizações</div>
          </div>

        </div>
      </div>
    </section>
  );
}
