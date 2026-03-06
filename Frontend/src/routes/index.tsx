import { createBrowserRouter } from "react-router-dom";

import Homepage from "../pages/home.page";
import Login from "../pages/login.page";
import ProtectedRoute from "../components/protectedRoute.components";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },

  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Homepage />
      </ProtectedRoute>
    ),
  },
]);