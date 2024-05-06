import { createBrowserRouter } from "react-router-dom";

import Record from "./pages/Record/Record";
import { AppLayout } from "./_layouts/AppLayout/AppLayout";
import { UnauthenticatedLayout } from "./_layouts/UnauthenticatedLayout/UnauthenticatedLayout";
import { SignIn } from "./pages/SignIn/SignIn";
import { SignUp } from "./pages/SignUp/SignUp";
import { Home } from "./pages/Home/Home";

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
      {
        path: "/Record",
        element: <Record />,
      },
    ],
  },
  {
    path: "/",
    element: <UnauthenticatedLayout />,
    children: [
      {
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        path: "/sign-up",
        element: <SignUp />,
      },
    ],
  },
]);
