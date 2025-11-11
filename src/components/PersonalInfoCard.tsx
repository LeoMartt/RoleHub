import { useState } from "react";
import type { User, UpdateUserPayload } from "../types";

type Props = {
  user: User;
  onSave: (patch: UpdateUserPayload) => Promise<void>;
};

export default function PersonalInfoCard({ user, onSave }: Props) {
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(user.fullName);
  const [location, setLocation] = useState(user.location ?? "");
  const [bio, setBio] = useState(user.bio ?? "");
  const [saving, setSaving] = useState(false);

  const startEdit = () => setEditing(true);
  const cancel = () => {
    setEditing(false);
    setFullName(user.fullName);
    setLocation(user.location ?? "");
    setBio(user.bio ?? "");
  };

  const save = async () => {
    setSaving(true);
    try {
      await onSave({ fullName: fullName.trim(), location: location.trim(), bio: bio.trim() });
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card shadow-sm rounded-4 border-0">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-person-check text-success fs-5" />
            <h5 className="mb-0 fw-semibold">Informações Pessoais</h5>
          </div>

        {!editing ? (
          <button className="btn btn-light rounded-pill px-3" onClick={startEdit}>
            <i className="bi bi-pencil me-2" /> Editar
          </button>
        ) : (
          <div className="d-flex gap-2">
            <button className="btn btn-outline-secondary rounded-pill px-3" onClick={cancel}>
              Cancelar
            </button>
            <button className="btn btn-success rounded-pill px-3" onClick={save} disabled={saving}>
              {saving ? "Salvando…" : "Salvar"}
            </button>
          </div>
        )}
        </div>

        <p className="text-body-secondary mb-4">Gerencie suas informações de perfil</p>

        <div className="row g-3">
          <div className="col-12 col-md-6">
            <label className="form-label">Nome completo</label>
            <input
              className="form-control"
              value={fullName}
              disabled={!editing}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label">E-mail</label>
            <input className="form-control" value={user.email} disabled />
          </div>

          <div className="col-12">
            <label className="form-label">Localização</label>
            <input
              className="form-control"
              value={location}
              disabled={!editing}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="col-12">
            <label className="form-label">Biografia</label>
            <textarea
              className="form-control"
              rows={4}
              value={bio}
              disabled={!editing}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
