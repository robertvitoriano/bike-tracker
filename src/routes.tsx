import { createBrowserRouter } from "react-router-dom";

import Home from "./pages/Home/Home";
import { AppLayout } from "./_layouts/AppLayout/AppLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/home",
        element: <Home />,
      },
    ],
  },
]);
