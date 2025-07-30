import { Routes, Route, Navigate } from "react-router-dom";

// Public pages
import HomePage from "../pages/HomePage";
import Login from "../pages/Login";
import Locations from "../pages/Locations";
import SingleLocation from "../pages/SingleLocation";

// Protected pages
// Dashboard import removed
import UpdateListing from "../pages/UpdateListing";

// Admin pages
import ViewReservations from "../pages/Admin/ViewReservations";
import ViewListings from "../pages/Admin/ViewListings";
import CreateListing from "../pages/Admin/CreateListing";

// Protected route wrapper
import ProtectedRoute from "./ProtectedRoute";

// User pages
import UserReservations from "../pages/UserReservations";
import Payment from "../pages/Payment";
// You can create Favourites and Profile pages similarly
const Favourites = () => <div style={{padding:'2rem'}}><h2>Favourites</h2><p>Your favourite listings will appear here.</p></div>;
const Profile = () => <div style={{padding:'2rem'}}><h2>Profile</h2><p>Your profile details will appear here.</p></div>;

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/listing" element={<Locations />} />
      <Route path="/listing/:id" element={<SingleLocation />} />
      <Route path="/user-reservations" element={<UserReservations />} />
      <Route path="/favourites" element={<Favourites />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/profile" element={<Profile />} />

      {/* Redirect from old path */}
      <Route path="/location/all" element={<Navigate to="/listing" replace />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        {/* Dashboard route removed */}
        <Route path="/reservations" element={<ViewReservations />} />
        <Route path="/listings" element={<ViewListings />} />
        <Route path="/listings/new" element={<CreateListing />} />
        <Route path="/listings/:id/edit" element={<UpdateListing />} />
      </Route>
    </Routes>
  );
}
