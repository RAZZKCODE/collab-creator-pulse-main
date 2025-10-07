// utils/AdminPrivateRoute.tsx
import { Navigate } from "react-router-dom";

export function AdminPrivateRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem("accessToken");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  
  if (!token) return <Navigate to="/login" />;
  if (!user.is_admin) return <Navigate to="/" />;
  
  return children;
}