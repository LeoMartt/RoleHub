import { Outlet } from "react-router-dom";
import AppNavbar from "./AppNavBar";
export default function MainLayout() {
  return (
    <div className="min-vh-100 bg-main-custom">
      <AppNavbar />
      <main className="pb-4">
      <Outlet />
      </main>
    </div>
  );
}
