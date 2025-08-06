import { API_URL } from '../constants';

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BookingCard.css";

export default function BookingCard({ listing }) {
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [nights, setNights] = useState(7);
  // Only use loading for reservation network request
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Use price from listing (database), fallback to 180 if missing
  const pricePerNight = Number(listing.price) || 180;
  const price = pricePerNight * guests;
  const reviews = listing.reviews || 0;
  const rating = listing.rating || 0;
  const cleaningFee = 80;
  const serviceFee = 82;
  const taxes = 36;
  const weeklyDiscount = listing.weeklyDiscount || 0;
  const subtotal = price * nights;
  const total = subtotal - weeklyDiscount + cleaningFee + serviceFee + taxes;

  // Calculate nights from dates
  function calculateNights(start, end) {
    if (!start || !end) return 0;
    const d1 = new Date(start);
    const d2 = new Date(end);
    const diff = Math.max(0, (d2 - d1) / (1000 * 60 * 60 * 24));
    return diff;
  }

  React.useEffect(() => {
    setNights(calculateNights(checkIn, checkOut) || 1);
  }, [checkIn, checkOut]);

  const handleReserve = async () => {
    setError("");
    const user = JSON.parse(localStorage.getItem("airbnb_user") || "{}");
    if (!user.username || user.username === "Guest") {
      navigate("/login");
      return;
    }
    setLoading(true); // Only for reservation network request
    const reservation = {
      listingId: listing._id,
      listingName: listing.listingName,
      image: listing.images?.[0],
      rooms: listing.rooms || listing.beds || "",
      amenities: listing.amenities,
      rating: listing.rating,
      reviews: listing.reviews,
      price: price,
      checkIn,
      checkOut,
      guests,
      user: user.username
    };
    try {
      await fetch(`${API_URL}/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reservation)
      });
      await fetch(`${API_URL}/user-reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reservation)
      });
      navigate("/payment", { state: { amount: total, email: reservation.user } });
    } catch (err) {
      setError("Failed to reserve. Please try again.");
    } finally {
      setLoading(false); // Only for reservation network request
    }
  };

  return (
    <div className="booking-card">
      <p className="price"><strong>R{price}</strong> / night</p>
      <p className="sub-rating">⭐ {rating} · {reviews} reviews</p>
      <label style={{fontWeight:'bold', fontSize:'0.95em', marginTop:8, display:'block', color:'#000'}}>Select check-in date</label>
      <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} />
      <label style={{fontWeight:'bold', fontSize:'0.95em', marginTop:8, display:'block', color:'#000'}}>Select check-out date</label>
      <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} />
      <label style={{fontWeight:'bold', fontSize:'0.95em', marginTop:8, display:'block', color:'#000'}}>Select number of guests</label>
      <input
        type="number"
        placeholder="Guests"
        min={1}
        max={listing.maxGuests || 10}
        value={guests}
        onChange={e => setGuests(Number(e.target.value))}
      />
      {/* Reservation success message removed. Only show after payment. */}
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      <p className="disclaimer">You won’t be charged yet</p>
      <div className="cost-breakdown">
        <p>R{price} × {nights} nights <span>R{subtotal}</span></p>
        <p>Weekly discount <span>–R{weeklyDiscount}</span></p>
        <p>Cleaning fee <span>R{cleaningFee}</span></p>
        <p>Service fee <span>R{serviceFee}</span></p>
        <p>Occupancy taxes <span>R{taxes}</span></p>
        <hr />
        <p className="total">Total <span>R{total}</span></p>
        <button className="reserve-btn" onClick={handleReserve} disabled={loading || !checkIn || !checkOut || guests < 1} style={{ width: '100%', marginTop: 12 }}>
          {loading ? "Reserving..." : "Reserve"}
        </button>
      </div>
    </div>
  );
}
