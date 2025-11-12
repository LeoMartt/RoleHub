import { useRef, useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { createEvent, uploadEventImage } from "../api/events";
import { datePtToIso, timeToBackend, maskDate, maskTime } from "../utils/datetime";
import { toastError, toastSuccess } from "../utils/toast";
import { getErrorMessage } from "../errors";
import type { CreateEventPayload } from "../types";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
  organizerId: number; // obrigatório (usuário logado)
};

type FormValues = {
  title: string;
  description: string;
  date: string;     // dd/mm/aaaa
  time: string;     // HH:mm
  location: string;
  category: string;
};

export default function CreateEventModal({ open, onClose, onCreated, organizerId }: Props) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue } =
    useForm<FormValues>({
      defaultValues: { title: "", description: "", date: "", time: "", location: "", category: "" },
    });

  const [dateVal, setDateVal] = useState("");
  const [timeVal, setTimeVal] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  const onPickImage = () => fileRef.current?.click();

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      toastError("Selecione um arquivo de imagem.");
      e.target.value = "";
      return;
    }
    setImageFile(f);
  };

  const onSubmit = async (v: FormValues) => {
    try {
      const payload: CreateEventPayload = {
        title: v.title.trim(),
        description: v.description.trim(),
        date: datePtToIso(v.date.trim()),
        time: timeToBackend(v.time.trim()),
        location: v.location.trim(),
        category: v.category.trim(),
        imageUrl: null,
      };

      // 1) cria o evento
      const created = await createEvent(payload, organizerId);

      // 2) se escolheu imagem, faz upload via PUT /events/{id}/image
      if (imageFile) {
        try {
          await uploadEventImage(Number(created.id), imageFile);
        } catch (err) {
          // não falhar a criação inteira por causa da imagem
          toastError(getErrorMessage("IMAGE_UPLOAD", err));
        }
      }

      toastSuccess("Evento criado com sucesso!");
      onCreated?.();
      onClose();
    } catch (e) {
      toastError(getErrorMessage("EVENTS_CREATE", e));
    }
  };

  return (
    <div className="ec-modal-backdrop" role="dialog" aria-modal="true">
      <div className="ec-modal-card ec-modal-card--sm rounded-4">
        <div className="ec-modal-header rounded-top-4">
          <div className="ec-modal-title">
            <span className="ec-icon-wrap">
              <i className="bi bi-calendar-event" />
            </span>
            Criar Novo Evento
          </div>
          <button className="ec-close" onClick={onClose} aria-label="Fechar">
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <div className="p-3 p-md-4 ec-modal-body-compact">
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Título */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Título do Evento *</label>
              <input
                type="text"
                className={`form-control ${errors.title ? "is-invalid" : ""}`}
                placeholder="Ex: Festa Junina do Bairro"
                {...register("title", { required: "Informe o título." })}
              />
              {errors.title && <div className="invalid-feedback">{errors.title.message}</div>}
            </div>

            {/* Descrição */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Descrição</label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="Descreva seu evento..."
                {...register("description")}
              />
            </div>

            {/* Data + Hora */}
            <div className="row">
              <div className="col-12 col-md-6 mb-3">
                <label className="form-label fw-semibold d-flex align-items-center gap-2 mb-1">
                  <i className="bi bi-calendar3 text-success" /> Data *
                </label>
                <div className="input-group">
                  <input
                    type="text"
                    className={`form-control ${errors.date ? "is-invalid" : ""}`}
                    placeholder="dd/mm/aaaa"
                    value={dateVal}
                    {...register("date", {
                      required: "Informe a data.",
                      pattern: { value: /^\d{2}\/\d{2}\/\d{4}$/, message: "Use dd/mm/aaaa." },
                    })}
                    onChange={(e) => {
                      const v = maskDate(e.target.value);
                      setDateVal(v);
                      setValue("date", v, { shouldValidate: true });
                    }}
                    inputMode="numeric"
                    autoComplete="off"
                  />
                  <span className="input-group-text bg-body-secondary">
                    <i className="bi bi-calendar-event" />
                  </span>
                </div>
                {errors.date && <div className="invalid-feedback d-block">{errors.date.message}</div>}
              </div>

              <div className="col-12 col-md-6 mb-3">
                <label className="form-label fw-semibold d-flex align-items-center gap-2 mb-1">
                  <i className="bi bi-clock text-success" /> Horário *
                </label>
                <div className="input-group">
                  <input
                    type="text"
                    className={`form-control ${errors.time ? "is-invalid" : ""}`}
                    placeholder="--:--"
                    value={timeVal}
                    {...register("time", {
                      required: "Informe o horário.",
                      pattern: { value: /^\d{2}:\d{2}$/, message: "Use HH:mm." },
                    })}
                    onChange={(e) => {
                      const v = maskTime(e.target.value);
                      setTimeVal(v);
                      setValue("time", v, { shouldValidate: true });
                    }}
                    inputMode="numeric"
                    autoComplete="off"
                  />
                  <span className="input-group-text bg-body-secondary">
                    <i className="bi bi-clock-history" />
                  </span>
                </div>
                {errors.time && <div className="invalid-feedback d-block">{errors.time.message}</div>}
              </div>
            </div>

            {/* Localização */}
            <div className="mb-3">
              <label className="form-label fw-semibold d-flex align-items-center gap-2">
                <i className="bi bi-geo-alt text-success" /> Localização *
              </label>
              <input
                type="text"
                className={`form-control ${errors.location ? "is-invalid" : ""}`}
                placeholder="Ex: Praça Central, Centro"
                {...register("location", { required: "Informe a localização." })}
              />
              {errors.location && <div className="invalid-feedback">{errors.location.message}</div>}
            </div>

            {/* Categoria */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Categoria *</label>
              <input
                type="text"
                className={`form-control ${errors.category ? "is-invalid" : ""}`}
                placeholder="Ex: Música, Gastronomia, Esporte..."
                {...register("category", { required: "Informe a categoria." })}
              />
              {errors.category && <div className="invalid-feedback">{errors.category.message}</div>}
            </div>

            {/* Imagem do evento (opcional) */}
            <div className="mb-4">
              <label className="form-label fw-semibold d-flex align-items-center gap-2">
                <i className="bi bi-image" /> Imagem do evento (opcional)
              </label>
              <div className="d-flex gap-2">
                <button type="button" className="btn btn-outline-secondary rounded-pill px-3" onClick={onPickImage}>
                  <i className="bi bi-upload me-2" />
                  Selecionar imagem
                </button>
                <span className="align-self-center small text-body-secondary">
                  {imageFile ? imageFile.name : "Nenhum arquivo selecionado"}
                </span>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="d-none"
                onChange={onFileChange}
              />
            </div>

            {/* Actions */}
            <div className="d-flex gap-3 justify-content-between">
              <button type="button" className="btn btn-light rounded-pill px-4" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-success rounded-pill px-4" disabled={isSubmitting}>
                {isSubmitting ? "Criando…" : "Criar Evento"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
