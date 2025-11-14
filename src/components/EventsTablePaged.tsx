import { useMemo, useState } from "react";
import type { Event } from "../types/event";
import { formatEventDatePt } from "../utils/datetime";

type ActionConfig = {
  label: string;
  variant?: "danger" | "outline-danger" | "secondary" | "outline-secondary";
  onClick: (ev: Event) => void | Promise<void>;
  isBusy?: (id: number) => boolean; 
  title?: string;
};

type Props = {
  title: string;
  events: Event[];
  emptyMessage?: string;
  pageSize?: number;
  action?: ActionConfig;
};

export default function EventsTablePaged({
  title,
  events,
  emptyMessage = "Nenhum evento encontrado.",
  pageSize = 10,
  action,
}: Props) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil((events?.length || 0) / pageSize));

  const slice = useMemo(() => {
    const start = (page - 1) * pageSize;
    return (events ?? []).slice(start, start + pageSize);
  }, [events, page, pageSize]);

  const prev = () => setPage((p) => Math.max(1, p - 1));
  const next = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <div className="card shadow-sm rounded-4 border-0 h-100">
      <div className="card-body p-0">
        <div className="px-3 px-md-4 pt-3 pt-md-4">
          <h6 className="fw-semibold mb-3">{title}</h6>
        </div>

        <div className="table-responsive">
          <table className="table mb-0 align-middle">
            <thead>
              <tr className="text-body-secondary">
                <th style={{ width: "25%" }} className="text-center">Título</th>
                <th style={{ width: "20%" }} className="text-center">Data</th>
                <th style={{ width: "25%" }} className="text-center">Local</th>
                <th style={{ width: "10%" }} className="text-center">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {slice.map((ev) => (
                <tr key={ev.id}>
                  <td className="py-3 fw-medium text-center">{ev.title}</td>
                  <td className="py-3 text-body-secondary text-center">
                    {formatEventDatePt(ev.date, ev.time)}
                  </td>
                  <td className="py-3 text-body-secondary text-center">{ev.location}</td>
                  <td className="py-3 text-end">
                    {action && (
                      <button
                        type="button"
                        className={
                          "btn btn-sm rounded-pill px-3 " +
                          (action.variant === "danger"
                            ? "btn-danger"
                            : action.variant === "outline-danger"
                            ? "btn-outline-danger"
                            : action.variant === "secondary"
                            ? "btn-secondary"
                            : "btn-outline-secondary")
                        }
                        onClick={() => action.onClick(ev)}
                        disabled={action.isBusy?.(ev.id)}
                        title={action.title}
                      >
                        {action.isBusy?.(ev.id) ? (
                          <>
                            <i className="bi bi-hourglass-split me-2" />
                            Processando…
                          </>
                        ) : (
                          action.label
                        )}
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {slice.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center text-body-secondary py-4">
                    {emptyMessage}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação no rodapé, igual PeopleTable */}
        <div className="d-flex justify-content-end align-items-center gap-2 p-3 border-top">
          <button className="btn btn-sm btn-light" onClick={prev} disabled={page === 1}>
            Anterior
          </button>
          <span className="badge bg-success-subtle text-success-emphasis">{page}</span>
          <button
            className="btn btn-sm btn-light"
            onClick={next}
            disabled={page === totalPages}
          >
            Próxima
          </button>
        </div>
      </div>
    </div>
  );
}
