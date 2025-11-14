import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import { getErrorMessage } from "../errors";
import { toastError, toastSuccess } from "../utils/toast";

type FormValues = {
  email: string;
  password: string;
};

export default function Login() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    defaultValues: { email: "", password: "" }
  });
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (values: FormValues) => {
    try {
      await login(values);
      toastSuccess("Bem-vindo!");
      navigate("/"); 
    } catch (e) {
      toastError(getErrorMessage("AUTH_LOGIN", e));
    }
  };

  return (
    <div className="container vh-100 d-flex justify-content-center align-items-center flex-column" style={{ maxWidth: 520 }}>
      <div className="text-center mb-4">
        <i className="bi bi-calendar-event text-success fs-1 d-block" />
        <div className="fs-4 fw-semibold">RolêHub</div>
      </div>

      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body p-4 p-md-5">
          <h2 className="text-center fw-semibold mb-1">Entrar na sua conta</h2>
          <p className="text-center text-body-secondary mb-4">
            Entre com suas credenciais para acessar seus eventos
          </p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* E-mail */}
            <div className="mb-3">
              <label className="form-label fw-semibold">E-mail</label>
              <div className="input-group">
                <span className="input-group-text bg-body-secondary">
                  <i className="bi bi-envelope" />
                </span>
                <input
                  type="email"
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  placeholder="Digite seu e-mail"
                  autoComplete="email"
                  {...register("email", {
                    required: "Informe seu e-mail.",
                    pattern: { value: /\S+@\S+\.\S+/, message: "E-mail inválido." }
                  })}
                />
                {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
              </div>
            </div>

            {/* Senha */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Senha</label>
              <div className="input-group">
                <span className="input-group-text bg-body-secondary">
                  <i className="bi bi-lock" />
                </span>
                <input
                  type={showPass ? "text" : "password"}
                  className={`form-control ${errors.password ? "is-invalid" : ""}`}
                  placeholder="Digite sua senha"
                  autoComplete="current-password"
                  {...register("password", { required: "Informe sua senha." })}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPass(s => !s)}
                  aria-label={showPass ? "Ocultar senha" : "Mostrar senha"}
                >
                  <i className={`bi ${showPass ? "bi-eye-slash" : "bi-eye"}`} />
                </button>
                {errors.password && <div className="invalid-feedback d-block">{errors.password.message}</div>}
              </div>
            </div>

            {/* Entrar */}
            <button
              type="submit"
              className="btn btn-success rounded-pill w-100 py-2 fw-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Entrando..." : "Entrar"}
            </button>

            {/* Links inferiores */}
            <div className="text-center mt-3">
              <div className="text-body-secondary">Não tem uma conta?</div>
              <Link to="/signup" className="link-success fw-semibold">Criar nova conta</Link>
            </div>

            <div className="text-center mt-3">
              <Link to="/" className="link-secondary">Voltar ao início</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
