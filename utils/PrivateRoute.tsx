import { Navigate } from "react-router-dom";

export function PrivateRoute({ children }: { children: JSX.Element }) {
  const isAuth = !!localStorage.getItem("authToken"); // check token
  return isAuth ? children : <Navigate to="/login" />;
}
