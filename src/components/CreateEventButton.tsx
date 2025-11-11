import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateEventModal from './CreateEventModal';
import { useAuth } from '../auth/AuthContext';      // precisa do user logado
import { toastError } from '../utils/toast';

type Props = {
  onCreated?: () => void;
  className?: string;
};

export default function CreateEventButton({ onCreated, className }: Props) {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const openModal = () => {
    if (!user?.id) {
      toastError('Faça login para criar um evento.');
      navigate('/login');
      return;
    }
    setOpen(true);
  };

  return (
    <>
      <button
        type="button"
        className={className ?? "btn btn-light text-success fw-semibold rounded-pill px-4 py-2"}
        onClick={openModal}
      >
        Criar Meu Evento <i className="bi bi-arrow-right-short ms-2" />
      </button>

      {user?.id && (
        <CreateEventModal
          open={open}
          onClose={() => setOpen(false)}
          onCreated={onCreated}
          organizerId={Number(user.id)}           // <<< passa o organizerId
        />
      )}
    </>
  );
}
