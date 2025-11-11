import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../api/auth';
import { toastError, toastSuccess } from '../utils/toast';
import { getErrorMessage } from '../errors';

type FormValues = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function Signup() {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } =
    useForm<FormValues>({ defaultValues: { fullName: '', email: '', password: '', confirmPassword: '' } });

  const [showPass, setShowPass] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (v: FormValues) => {
    try {
      await signup({ fullName: v.fullName, email: v.email, password: v.password });
      toastSuccess('Conta criada! Faça login.');
      navigate('/login');
    } catch (e) {
      toastError(getErrorMessage('AUTH_SIGNUP', e));
    }
  };

  const pwd = watch('password');

  return (
    <div className="container" style={{ maxWidth: 560 }}>
      <div className="text-center mb-4">
        <i className="bi bi-calendar-event text-success fs-1 d-block" />
        <div className="fs-4 fw-semibold">EventConnect</div>
      </div>

      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body p-4 p-md-5">
          <h2 className="text-center fw-semibold mb-1">Criar nova conta</h2>
          <p className="text-center text-body-secondary mb-4">
            Crie sua conta e comece a descobrir eventos incríveis
          </p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Nome completo */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Nome completo</label>
              <input
                type="text"
                className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
                placeholder="Digite seu nome completo"
                {...register('fullName', { required: 'Informe seu nome completo.' })}
              />
              {errors.fullName && <div className="invalid-feedback">{errors.fullName.message}</div>}
            </div>

            {/* E-mail */}
            <div className="mb-3">
              <label className="form-label fw-semibold">E-mail</label>
              <div className="input-group">
                <span className="input-group-text bg-body-secondary">
                  <i className="bi bi-envelope" />
                </span>
                <input
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  placeholder="Digite seu e-mail"
                  autoComplete="email"
                  {...register('email', {
                    required: 'Informe seu e-mail.',
                    pattern: { value: /\S+@\S+\.\S+/, message: 'E-mail inválido.' }
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
                  type={showPass ? 'text' : 'password'}
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  placeholder="Digite sua senha"
                  autoComplete="new-password"
                  {...register('password', {
                    required: 'Informe uma senha.',
                    minLength: { value: 6, message: 'Mínimo de 6 caracteres.' }
                  })}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPass(s => !s)}
                  aria-label={showPass ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  <i className={`bi ${showPass ? 'bi-eye-slash' : 'bi-eye'}`} />
                </button>
                {errors.password && <div className="invalid-feedback d-block">{errors.password.message}</div>}
              </div>
            </div>

            {/* Confirmar senha */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Confirmar senha</label>
              <div className="input-group">
                <span className="input-group-text bg-body-secondary">
                  <i className="bi bi-lock" />
                </span>
                <input
                  type={showPass2 ? 'text' : 'password'}
                  className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                  placeholder="Confirme sua senha"
                  autoComplete="new-password"
                  {...register('confirmPassword', {
                    required: 'Confirme sua senha.',
                    validate: (v) => v === pwd || 'As senhas não conferem.'
                  })}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPass2(s => !s)}
                  aria-label={showPass2 ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  <i className={`bi ${showPass2 ? 'bi-eye-slash' : 'bi-eye'}`} />
                </button>
                {errors.confirmPassword && <div className="invalid-feedback d-block">
                  {errors.confirmPassword.message}
                </div>}
              </div>
            </div>

            {/* Criar conta */}
            <button
              type="submit"
              className="btn btn-success rounded-pill w-100 py-2 fw-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Criando...' : 'Criar conta'}
            </button>

            {/* Links */}
            <div className="text-center mt-3">
              <div className="text-body-secondary">Já tem uma conta?</div>
              <Link to="/login" className="link-success fw-semibold">Fazer login</Link>
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
