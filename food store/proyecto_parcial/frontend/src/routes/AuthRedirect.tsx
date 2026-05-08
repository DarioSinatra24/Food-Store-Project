import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthRedirect() {
  const { token } = useAuth();

  // si hay sesión → productos
  if (token) {
    return <Navigate to="/productos" replace />;
  }

  // si NO hay sesión → login
  return <Navigate to="/login" replace />;
}