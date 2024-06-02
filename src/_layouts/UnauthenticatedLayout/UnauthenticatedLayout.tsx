import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import biketrackerRoundedIcon from "./../../../public/biketracker-round-icon.png";
export function UnauthenticatedLayout() {
  const token = useAuthStore((state: any) => state.token);
  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, []);
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-10 justify-center items-center w-screen h-screen bg-primary">
      <img src={biketrackerRoundedIcon} className="w-28 h-28" />
      <Outlet />
    </div>
  );
}
