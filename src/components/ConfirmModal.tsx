import React from "react";

type Props = {
  open: boolean;
  title?: string;
  message?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
  busy?: boolean;
};

export default function ConfirmModal({
  open,
  title = "Confirmar ação",
  message = "Tem certeza que deseja prosseguir?",
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  onConfirm,
  onClose,
  busy = false,
}: Props) {
  if (!open) return null;

  return (
    <div className="ec-modal-backdrop" role="dialog" aria-modal="true">
      <div className="ec-modal-card ec-modal-card--sm rounded-4">
        <div className="ec-modal-header rounded-top-4">
          <div className="ec-modal-title">{title}</div>
          <button
            className="ec-close"
            onClick={onClose}
            aria-label="Fechar"
            disabled={busy}
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <div className="p-3 p-md-4">
          {typeof message === "string" ? <p className="mb-0">{message}</p> : message}
        </div>

        <div className="d-flex justify-content-end gap-2 p-3 border-top">
          <button
            type="button"
            className="btn btn-light rounded-pill px-4"
            onClick={onClose}
            disabled={busy}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className="btn btn-danger rounded-pill px-4"
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? (
              <>
                <i className="bi bi-hourglass-split me-2" />
                Processando…
              </>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
