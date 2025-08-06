import { API_URL } from '../constants';
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const PAYSTACK_PUBLIC_KEY = "pk_test_52207e2573a83fa78c013296d9c0aa5c6533c9cf"; // Replace with your real key

function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingState = location.state || {};
  const [email, setEmail] = useState(bookingState.email || "");
  const [amount] = useState(bookingState.amount || "");
  const [name, setName] = useState("");
  const [paying, setPaying] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePay = () => {
    if (!email || !amount) return alert("Please enter all details");
    setPaying(true);
    const handler = window.PaystackPop && window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email,
      amount: parseInt(amount, 10) * 100, // Paystack expects kobo
      currency: "ZAR",
      name,
      callback: function (response) {
        setPaying(false);
        setSuccess(true);
        alert("Payment successful! Ref: " + response.reference);
        // Fetch the latest listing data by ID to get name, rooms, amenities, etc.
        (async () => {
          try {
            let listingData = {};
            if (bookingState.listingId) {
              const listingRes = await fetch(`${API_URL}/listings/${bookingState.listingId}`);
              const listingJson = await listingRes.json();
              // Try to get the listing object from various possible response shapes
              if (listingJson && listingJson.data) listingData = listingJson.data;
              else if (listingJson && listingJson.listing) listingData = listingJson.listing;
              else if (listingJson && listingJson._id) listingData = listingJson;
            }
            const user = JSON.parse(localStorage.getItem('airbnb_user') || '{}');
            const reservation = {
              listingId: bookingState.listingId,
              // Always use the name from the /listings/:id endpoint, fallback to empty string if not found
              listingName: listingData.listingName || listingData.name || '',
              image: (listingData.images && Array.isArray(listingData.images) && listingData.images[0]) ? listingData.images[0] : '',
              rooms: listingData.rooms || listingData.beds || listingData.maxGuests || '',
              amenities: listingData.amenities || [],
              rating: listingData.rating !== undefined ? listingData.rating : 0,
              reviews: listingData.reviews !== undefined ? listingData.reviews : 0,
              price: listingData.price !== undefined ? listingData.price : (amount || 0),
              checkIn: bookingState.checkIn,
              checkOut: bookingState.checkOut,
              guests: bookingState.guests,
              user: user.username || email,
              email,
              amount,
              name,
              reference: response.reference,
              date: new Date().toISOString()
            };
            const res = await fetch(`${API_URL}/user-reservations`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(reservation)
            });
            await res.json();
            setTimeout(() => {
              navigate("/user-reservations");
            }, 1200);
          } catch (err) {
            // Optionally handle error
          }
        })();
      },
      onClose: function () {
        setPaying(false);
        alert("Payment window closed");
      },
    });
    if (handler) handler.openIframe();
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", padding: 32, border: "1px solid #eee", borderRadius: 12 }}>
      <h2 style={{ color: "#ff385c" }}>Pay for Reservation</h2>
      <div style={{ marginBottom: 16 }}>
        <label style={{ color: "#222" }}>Email</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: "100%", padding: 8, marginTop: 4, color: "#222" }} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ color: "#222" }}>Name</label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} style={{ width: "100%", padding: 8, marginTop: 4, color: "#222" }} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ color: "#222" }}>Amount (ZAR)</label>
        <input type="number" value={amount} readOnly style={{ width: "100%", padding: 8, marginTop: 4, background: "#f5f5f5", color: "#222" }} />
      </div>
      <button onClick={handlePay} disabled={paying} style={{ background: "#ff385c", color: "#fff", padding: "12px 32px", border: "none", borderRadius: 8, fontWeight: "bold", fontSize: "1.1rem", cursor: "pointer" }}>
        {paying ? "Processing..." : "Confirm & Pay"}
      </button>
      {success && (
        <div style={{ color: '#fff', background: '#4caf50', padding: '12px 24px', borderRadius: '8px', marginTop: '24px', fontWeight: 'bold', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}>
          Reservation successful!
        </div>
      )}
      <p style={{ marginTop: 24, color: "#888" }}>
        You will be redirected to Paystack to complete your payment.
      </p>
    </div>
  );
}

export default Payment;
