import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "@/lib/store/authStore";

export function UnauthenticatedLayout() {
  const token = useAuthStore((state: any) => state.token);
  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, []);
  const navigate = useNavigate();
  return (
    <div className="flex justify-center w-screen h-screen bg-primary">
      <Outlet />
    </div>
  );
}
