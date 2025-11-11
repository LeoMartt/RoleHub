import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-vh-100 bg-main-custom">
      <Outlet />
    </div>
  );
}