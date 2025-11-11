import { Outlet } from "react-router-dom";
import AppNavbar from "./AppNavBar";
export default function MainLayout() {
  return (
    <div className="min-vh-100 bg-dark-subtle">
      <AppNavbar />
      <main className="py-4">
      <Outlet />
      </main>
    </div>
  );
}
