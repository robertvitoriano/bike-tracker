import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/react-query";
import { SaveTrackDialog } from "./components/SaveTrackDialog";
import { PauseTrackingDialog } from "./components/PauseTrackingDialog";
import { MapProvider } from "react-map-gl";

export default function App() {
  return (
    <MapProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <SaveTrackDialog />
        <PauseTrackingDialog />
      </QueryClientProvider>
    </MapProvider>
  );
}
