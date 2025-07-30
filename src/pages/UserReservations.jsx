import { useEffect, useState } from "react";
import './Admin/Create/ListCard.css';

const UserReservations = () => {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    // Get user from localStorage
    // Get user from localStorage
    const userData = localStorage.getItem('airbnb_user');
    // Fetch reservations for this user
    // Replace with your API endpoint for user reservations
    fetch(`${import.meta.env.VITE_API_URL}/reservations?user=${encodeURIComponent(JSON.parse(userData)?.username || '')}`)
      .then(res => res.json())
      .then(data => setReservations(data));
  }, []);
  return (
    <div>
      <h3 style={{ marginLeft: '20px' }}>Your Reservations</h3>
      {reservations.length === 0 ? (
        <p style={{ marginLeft: '20px', color: '#888' }}>No reservations found.</p>
      ) : (
        <div style={{ overflowX: 'auto', margin: '20px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <thead style={{ background: '#ff385c' }}>
              <tr>
                <th style={{ padding: '12px', borderBottom: '1px solid #eee' }}>Image</th>
                <th style={{ padding: '12px', borderBottom: '1px solid #eee' }}>Hotel</th>
                <th style={{ padding: '12px', borderBottom: '1px solid #eee' }}>Rooms</th>
                <th style={{ padding: '12px', borderBottom: '1px solid #eee' }}>Amenities</th>
                <th style={{ padding: '12px', borderBottom: '1px solid #eee' }}>Rating</th>
                <th style={{ padding: '12px', borderBottom: '1px solid #eee' }}>Reviews</th>
                <th style={{ padding: '12px', borderBottom: '1px solid #eee' }}>Price</th>
                <th style={{ padding: '12px', borderBottom: '1px solid #eee' }}>Check-in</th>
                <th style={{ padding: '12px', borderBottom: '1px solid #eee' }}>Check-out</th>
                <th style={{ padding: '12px', borderBottom: '1px solid #eee' }}>Guests</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((res, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px', textAlign: 'center' }}>
                    <img src={res.image || "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=100&auto=format&fit=crop&q=60"} alt="listing" style={{ width: '80px', borderRadius: '8px' }} />
                  </td>
                  <td style={{ padding: '10px' }}>{res.listingName || '-'}</td>
                  <td style={{ padding: '10px' }}>{res.rooms || '-'}</td>
                  <td style={{ padding: '10px' }}>{res.amenities?.join(', ') || '-'}</td>
                  <td style={{ padding: '10px' }}>{res.rating || '-'}</td>
                  <td style={{ padding: '10px' }}>{res.reviews || '-'}</td>
                  <td style={{ padding: '10px' }}>R{res.price || '-'}</td>
                  <td style={{ padding: '10px' }}>{res.checkIn || '-'}</td>
                  <td style={{ padding: '10px' }}>{res.checkOut || '-'}</td>
                  <td style={{ padding: '10px' }}>{res.guests || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserReservations;
