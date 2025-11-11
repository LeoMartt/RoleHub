// src/components/AppNavbar.tsx
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthFlag } from "../hooks/useAuthFlag";
import { logout } from "../api/auth";

export default function AppNavbar() {
  const isAuth = useAuthFlag();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login"); // ou "/" se preferir
  };

  return (
    <nav className="navbar bg-white shadow-sm mb-0 border-0">
      <div className="container d-flex align-items-center position-relative py-3">
        {/* Brand */}
        <NavLink to="/" className="navbar-brand d-flex align-items-center gap-2 m-0">
          <i className="bi bi-calendar-event text-success fs-4" />
          <span className="fw-semibold">EventConnect</span>
        </NavLink>

        {/* Centro */}
        <ul className="nav position-absolute start-50 translate-middle-x d-none d-sm-flex">
          <li className="nav-item">
            <NavLink
              to="/"
              className={({ isActive }) =>
                "nav-link px-4 py-2 rounded-pill " +
                (isActive ? "bg-success text-white fw-semibold" : "text-body")
              }
            >
              Eventos
            </NavLink>
          </li>
        </ul>

        {/* Direita */}
        <div className="ms-auto d-flex gap-2">
          {isAuth ? (
            <>
              <NavLink to="/profile" className="btn btn-success rounded-pill px-3">
                <i className="bi bi-person-circle me-2" />
                Perfil
              </NavLink>
              <button
                className="btn btn-outline-secondary rounded-pill px-3"
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-right me-2" />
                Sair
              </button>
            </>
          ) : (
            <NavLink to="/login" className="btn btn-light rounded-pill px-3">
              <i className="bi bi-box-arrow-in-right me-2" />
              Login
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}
