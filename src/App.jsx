// src/App.jsx

import AppRoutes from "./routes/AppRoutes";
import "./App.css";
import Nav from "./components/Nav/Nav";
import { useLocation } from "react-router-dom";
import AdminFilter from "./pages/Admin/AdminFilter";
import { LocationSyncProvider } from "./context/LocationSyncContext";

export default function App() {
  const location = useLocation();
  const hideNav = location.pathname === "/listing";
  const isAdmin = location.pathname.startsWith("/listings") || location.pathname.startsWith("/reservations");
  return (
    <LocationSyncProvider>
      {!hideNav && <Nav />}
      {isAdmin && <AdminFilter />}
      <AppRoutes />
    </LocationSyncProvider>
  );
}
