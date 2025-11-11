import type { ChangeEvent } from "react";
import type { eventsLocalization } from '../types';

function formatDateQuery(v: string) {
  const onlyDigits = v.replace(/\D/g, "").slice(0, 8); // até 8 dígitos
  return onlyDigits
    .replace(/^(\d{2})(\d)/, "$1/$2")       // dd/
    .replace(/^(\d{2}\/\d{2})(\d)/, "$1/$2"); // dd/mm/
}

type Props = {
  search: string;
  onSearch: (v: string) => void;

  dateQuery: string;
  onDateQuery: (v: string) => void;

  location: string;
  onLocation: (v: string) => void;

  locations: eventsLocalization[]; // lista única
};

export default function EventsFilter({
  search,
  onSearch,
  dateQuery,
  onDateQuery,
  location,
  onLocation,
  locations,
}: Props) {
  return (
    <div className="container mb-4">
      <div className="bg-white shadow-sm rounded-4 p-3 p-md-4">

        {/* Buscar eventos */}
        <div className="mb-3">
          <div className="input-group">
            <span className="input-group-text bg-body-secondary">
              <i className="bi bi-search" />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Buscar eventos..."
              value={search}
              onChange={(e: ChangeEvent<HTMLInputElement>) => onSearch(e.target.value)}
              autoComplete="off"
            />
          </div>
        </div>

        {/* Data (texto para aceitar parcial: dd, dd/mm, dd/mm/aaaa) */}
        <div className="mb-3">
          <div className="input-group">
            <span className="input-group-text bg-body-secondary">
              <i className="bi bi-calendar3" />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="dd/mm/aaaa"
              value={dateQuery || ""}               
              onChange={(e) => onDateQuery(formatDateQuery(e.target.value))}
              inputMode="numeric"
              autoComplete="off"
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => onDateQuery("")}
              aria-label="Limpar data"
              disabled={!dateQuery}
              title="Limpar"
            >
              <i className="bi bi-x-lg" />
            </button>
          </div>
        </div>

        {/* Localização */}
        <div>
          <div className="input-group">
            <span className="input-group-text bg-body-secondary">
              <i className="bi bi-geo-alt" />
            </span>
            <select
              className="form-select"
              value={location}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => onLocation(e.target.value)}
            >
              <option value="">Todas as localizações</option>
              {locations.map((loc) => (
                <option key={loc.location} value={loc.location}>
                  {loc.location}
                </option>
              ))}
            </select>
          </div>
        </div>

      </div>
    </div>
  );
}
