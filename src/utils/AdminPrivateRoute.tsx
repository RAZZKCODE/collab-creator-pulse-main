// src/utils/AdminPrivateRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";

export function AdminPrivateRoute() {
  const { user, loading } = useUser();
  const token = localStorage.getItem("accessToken");

  // While checking user status, you can show a loading indicator
  if (loading) {
    return <div>Loading...</div>;
  }

  // Check for token and admin status
  if (!token || !user?.is_admin) {
    // Redirect non-admins to the creator dashboard
    return <Navigate to="/" />;
  }
  
  // If the user is an admin, render the nested admin page (e.g., /admin/dashboard)
  return <Outlet />;
}