import { Outlet } from "react-router-dom";

export function UnauthenticatedLayout() {
  return (
    <div className="flex min-h-screen flex-col relative overflow-hidden">
      <Outlet />
    </div>
  );
}
