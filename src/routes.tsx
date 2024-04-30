import { createBrowserRouter } from "react-router-dom";

import Home from "./pages/Home/Home";
import { AppLayout } from "./_layouts/AppLayout/AppLayout";
import { UnauthenticatedLayout } from "./_layouts/UnauthenticatedLayout/UnauthenticatedLayout";
import { SignIn } from "./pages/SignIn/SignIn";
import { SignUp } from "./pages/SignUp/SignUp";

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
