import { Outlet } from "react-router-dom";
import ProfileNavBar from "./ProfileNavBar";

export default function ProfileLayout() {
  return (
    <div className="min-vh-100 bg-dark-subtle">
      <ProfileNavBar />
      <Outlet />
    </div>
  );
}
