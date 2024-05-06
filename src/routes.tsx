import { createBrowserRouter } from "react-router-dom";

import Record from "./pages/Record/Record";
import { AppLayout } from "./_layouts/AppLayout/AppLayout";
import { UnauthenticatedLayout } from "./_layouts/UnauthenticatedLayout/UnauthenticatedLayout";
import { SignIn } from "./pages/SignIn/SignIn";
import { SignUp } from "./pages/SignUp/SignUp";
import { Home } from "./pages/Home/Home";
import { Explore } from "./pages/Explore/Explore";
import { Profile } from "./pages/Profile/Profile";
import { Groups } from "./pages/Groups/Groups";

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
        path: "/record",
        element: <Record />,
      },
      {
        path: "/explore",
        element: <Explore />,
      },
      {
        path: "/groups",
        element: <Groups />,
      },
      {
        path: "/profile",
        element: <Profile />,
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
