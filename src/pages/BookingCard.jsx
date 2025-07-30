
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BookingCard.css";

export default function BookingCard({ listing }) {
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [nights, setNights] = useState(7);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Calculate price per guest
  const pricePerGuest = 180;
  const price = pricePerGuest * guests;
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
    setLoading(true);
    setError("");
    const user = JSON.parse(localStorage.getItem("airbnb_user") || "{}");
    const reservation = {
      image: listing.images?.[0],
      rooms: listing.rooms || listing.beds || "",
      amenities: listing.amenities,
      rating: listing.rating,
      reviews: listing.reviews,
      price: price,
      checkIn,
      checkOut,
      guests,
      user: user.username || "Guest"
    };
    try {
      // Post to /reservations (admin view)
      await fetch(`${import.meta.env.VITE_API_URL}/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reservation)
      });
      // Post to /user-reservations (user view)
      await fetch(`${import.meta.env.VITE_API_URL}/user-reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reservation)
      });
      navigate("/payment", { state: { amount: total, email: reservation.user } });
    } catch {
      setError("Failed to reserve. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="booking-card">
      <p className="price"><strong>R{price}</strong> / night</p>
      <p className="sub-rating">⭐ {rating} · {reviews} reviews</p>
      <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} />
      <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} />
      <input
        type="number"
        placeholder="Guests"
        min={1}
        max={listing.maxGuests || 10}
        value={guests}
        onChange={e => setGuests(Number(e.target.value))}
      />
      <button className="reserve-btn" onClick={handleReserve} disabled={loading || !checkIn || !checkOut || guests < 1}>
        {loading ? "Reserving..." : "Reserve"}
      </button>
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
      </div>
    </div>
  );
}
