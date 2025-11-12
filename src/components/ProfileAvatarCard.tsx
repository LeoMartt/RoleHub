import { useRef, useState, type ChangeEvent } from "react";
import type { User } from "../types";
import { uploadAvatar } from "../api/users";
import { toastError, toastSuccess } from "../utils/toast";
import { getErrorMessage } from "../errors";

type Props = {
  user: User;
  onAvatarUpdated?: (newUrl: string | null) => void;
};

export default function ProfileAvatarCard({ user, onAvatarUpdated }: Props) {
  const initials =
    user.fullName?.trim().split(/\s+/).slice(0, 2).map(p => p[0]?.toUpperCase()).join("") || "US";

  const fileRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const openPicker = () => fileRef.current?.click();

  const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // preview local
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);

    try {
      setUploading(true);
      const updated = await uploadAvatar(Number(user.id), file);
      const finalUrl = updated.avatarUrl ?? localUrl;
      onAvatarUpdated?.(finalUrl);
      toastSuccess("Avatar atualizado!");
    } catch (err) {
      setPreviewUrl(null);
      toastError(getErrorMessage("IMAGE_UPLOAD", err));
    } finally {
      setUploading(false);
      setTimeout(() => URL.revokeObjectURL(localUrl), 1000);
      e.target.value = ""; // limpa input
    }
  };

  const avatarSrc = previewUrl ?? user.avatarUrl ?? null;

  return (
    <div className="card shadow-sm rounded-4 border-0">
      <div className="card-body p-4 text-center">
        <div className="position-relative d-inline-block mb-3">
          {avatarSrc ? (
            <img
              src={avatarSrc}
              alt={user.fullName}
              className="rounded-circle object-fit-cover profile-avatar"
            />
          ) : (
            <div className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center profile-avatar fw-semibold">
              {initials}
            </div>
          )}

          <button
            type="button"
            className="btn btn-light rounded-circle p-2 shadow-sm position-absolute bottom-0 end-0"
            onClick={openPicker}
            disabled={uploading}
            aria-label="Alterar foto"
            title="Alterar foto"
          >
            <i className={`bi ${uploading ? "bi-hourglass-split" : "bi-camera"}`} />
          </button>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="d-none"
            onChange={onFileChange}
          />
        </div>

        <h5 className="fw-bold mb-2">{user.fullName}</h5>

        <div className="text-body-secondary small d-flex flex-column gap-1 align-items-center">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-envelope" />
            {user.email}
          </div>
        </div>

        <div className="mt-3">
          <span className="badge bg-success-subtle text-success-emphasis rounded-pill px-3 py-2">
            {user.createdAt ? `Membro desde ${new Date(user.createdAt).getFullYear()}` : "Membro"}
          </span>
        </div>
      </div>
    </div>
  );
}
