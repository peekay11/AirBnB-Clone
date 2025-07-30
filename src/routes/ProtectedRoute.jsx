import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const isAuthenticated = true; // 🔒 Replace this with actual logic later
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}
