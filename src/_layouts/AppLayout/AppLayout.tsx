import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { BottomNavigation } from "./BottomNavigation";
import { MapProvider } from "react-map-gl";

export function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col relative overflow-hidden">
      <MapProvider>
        <Header />
        <Outlet />
        <BottomNavigation />
      </MapProvider>
    </div>
  );
}
