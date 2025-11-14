import { useNavigate } from "react-router-dom";
import { logout } from "../api/auth";

export default function ProfileNavBar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login"); 
  };

  return (
    <nav className="bg-white shadow-sm mb-0 border-0">
      <div className="container d-flex align-items-center justify-content-between py-3">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="btn btn-link text-body text-decoration-none d-inline-flex align-items-center gap-2"
        >
          <i className="bi bi-arrow-left" />
          Voltar ao início
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="btn btn-outline-danger rounded-pill px-3"
        >
          <i className="bi bi-box-arrow-right me-2" />
          Sair
        </button>
      </div>
    </nav>
  );
}
