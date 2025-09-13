import { Navigate, Outlet } from "react-router-dom";

export function AdminPrivateRoute() {
  const isAuth = !!localStorage.getItem("authToken");
  const role = localStorage.getItem("role"); // "creator" | "brand" | "admin"

  return isAuth && role === "admin" ? <Outlet /> : <Navigate to="/login" />;
}
