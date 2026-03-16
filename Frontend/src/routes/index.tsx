import { createBrowserRouter } from "react-router-dom";

import Homepage from "../pages/home.page";
import Login from "../pages/login.page";
import ActivityDetailPage from "../pages/eventDetail.page";
import CreateEvent from "../pages/createEvent.page";
import ProtectedRoute from "../middleware/protectedRoute.middleware";
import PublicRoute from "../middleware/publicRoute.middleware";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Homepage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/event/:id",
    element: (
      <ProtectedRoute>
        <ActivityDetailPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/event/create",
    element: (
      <ProtectedRoute>
        <CreateEvent />
      </ProtectedRoute>
    ),
  },
]);