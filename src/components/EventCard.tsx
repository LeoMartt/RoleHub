import type { Event } from '../types/event';
import { formatEventDatePt } from '../utils/datetime';

type Props = {
  event: Event;
  onInterested?: (id: number) => void;
  disabled?: boolean;
};

export default function EventCard({ event, onInterested, disabled = false }: Props) {
  const { id, title, description, date, time, location,
          interestedCount, organizer, imageUrl, interestedByMe } = event;

  return (
    <div className="card shadow-sm border-0 rounded-4 overflow-hidden h-100">
      <div
        style={{
          height: 180,
          background: imageUrl
            ? `center/cover no-repeat url(${imageUrl})`
            : 'var(--bs-secondary-bg)'
        }}
      />
      <div className="card-body">
        <h5 className="card-title text-success fw-semibold">{title}</h5>
        <p className="card-text text-body-secondary mb-3">{description}</p>

        <ul className="list-unstyled small text-body-secondary mb-3">
          <li className="mb-2">
            <i className="bi bi-calendar-event me-2" />
            {formatEventDatePt(date, time)}
          </li>
          <li className="mb-2">
            <i className="bi bi-geo-alt me-2" />
            {location}
          </li>
        </ul>

        <div className="d-flex justify-content-between align-items-center">
          <span className="small">
            <i className="bi bi-people me-2" />
            {interestedCount} interessados
          </span>

          <button
            type="button"
            className={`btn rounded-pill px-3 ${
              interestedByMe ? "btn-success" : "btn-light border"
            }`}
            onClick={() => onInterested?.(id)}
            disabled={disabled}
            aria-busy={disabled}
          >
            {disabled ? (
              <i className="bi bi-hourglass-split me-2" />
            ) : interestedByMe ? (
              <i className="bi bi-heart-fill me-2" />
            ) : (
              <i className="bi bi-heart me-2" />
            )}
            {interestedByMe ? "Estou indo" : "Quero ir"}
          </button>
        </div>

        <hr />
        <div className="small text-body-secondary">
          Organizado por <span className="fw-semibold">{organizer?.fullName ?? '—'}</span>
        </div>
      </div>
    </div>
  );
}
