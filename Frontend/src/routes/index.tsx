import { createBrowserRouter } from "react-router-dom";

import Homepage from "../pages/home.page";
import Login from "../pages/login.page";
import ActivityDetailPage from "../pages/activityDetail.page";
import CreateEvent from "../pages/createEvent.page";
import ProtectedRoute from "../middleware/protectedRoute.components";

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
  {
    path: "/activity/:id",
    element: (
      <ProtectedRoute>
        <ActivityDetailPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/events/create",
    element: (
      <ProtectedRoute>
        <CreateEvent />
      </ProtectedRoute>
    ),
  },
]);