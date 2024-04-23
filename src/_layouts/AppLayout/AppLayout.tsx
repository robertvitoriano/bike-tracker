import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { BottomNavigation } from "./BottomNavigation";
export function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col relative overflow-hidden">
      <Header />
      <Outlet />
      <BottomNavigation />
    </div>
  );
}
