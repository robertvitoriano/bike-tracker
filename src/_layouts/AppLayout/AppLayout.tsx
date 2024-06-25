import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { Header } from "./Header";
import { BottomNavigation } from "./BottomNavigation";
import { useAuthStore } from "@/lib/store/authStore";

export function AppLayout() {
  const token = useAuthStore((state: any) => state.token);
  useEffect(() => {
    if (!token) {
      navigate("/sign-in");
    }
  }, []);

  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen flex-col relative overflow-hidden">
      {/* <Header /> */}
      <div className="flex flex-col">
        <Outlet />
      </div>
      <BottomNavigation />
    </div>
  );
}
