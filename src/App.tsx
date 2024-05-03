import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/react-query";
import { SaveTrackDialog } from "./components/SaveTrackDialog";
import { PauseTrackingDialog } from "./components/PauseTrackingDialog";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <SaveTrackDialog />
      <PauseTrackingDialog />
    </QueryClientProvider>
  );
}
