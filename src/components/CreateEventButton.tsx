import { useState } from "react";
import CreateEventModal from "./CreateEventModal";
import { useAuthFlag } from "../hooks/useAuthFlag";
import { useAuth } from "../auth/AuthContext";
import { toastError } from "../utils/toast";

type Props = {
  onCreated?: () => void;
  className?: string;
};

export default function CreateEventButton({ onCreated, className }: Props) {
  const [open, setOpen] = useState(false);
  const isAuth = useAuthFlag();
  const { user } = useAuth();

  const handleOpen = () => {
    if (!isAuth || !user?.id) {
      toastError("Você precisa estar logado para criar eventos.");
      return;
    }
    setOpen(true);
  };

  return (
    <>
      <button
        type="button"
        className={className ?? "btn btn-light text-success fw-semibold rounded-pill px-4 py-2"}
        onClick={handleOpen}
      >
        Criar Meu Evento <i className="bi bi-arrow-right-short ms-2" />
      </button>

      {open && user?.id && (
        <CreateEventModal
          open={open}
          onClose={() => setOpen(false)}
          onCreated={onCreated}
          organizerId={Number(user.id)}
        />
      )}
    </>
  );
}
