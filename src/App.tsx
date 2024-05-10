import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/react-query";
import { MapProvider } from "react-map-gl";
import { Toaster } from "@/components/ui/sonner";

export default function App() {
  return (
    <MapProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
      <Toaster />
    </MapProvider>
  );
}
