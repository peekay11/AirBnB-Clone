import { API_URL } from '../../constants';
import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ViewReservations.css';

const ViewReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${API_URL}/reservations`);
        const result = await res.json();
        // The API returns an array directly, not wrapped in { data: ... }
        setReservations(Array.isArray(result) ? result : []);
      } catch (err) {
        setError(err.message || 'Unable to fetch reservations. Please check your backend connection.');
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this reservation?')) return;
    try {
      const res = await fetch(`${API_URL}/reservations/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete reservation.');
      setReservations(prev => prev.filter(r => r._id !== id));
      toast.success('Reservation deleted successfully!');
    } catch (err) {
      setError(err.message || 'Failed to delete reservation.');
    }
  };
  return (
    <div style={{ display: 'flex', maxWidth: '1200px', margin: '0 auto', padding: '32px 0' }}>
      <ToastContainer position="bottom-right" />
      <div style={{ flex: 1, paddingLeft: '32px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '32px', color: '#222' }}>
          View Reservations ({reservations.length})
        </h2>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div style={{ color: 'red', marginBottom: '12px' }}>{error}</div>
        ) : (
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              background: '#fff',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            }}
          >
            <thead style={{ background: '#f8f8f8', color: '#222' }}>
              <tr>
                <th style={{ padding: '12px' }}>Booked by</th>
                <th style={{ padding: '12px' }}>Property</th>
                <th style={{ padding: '12px' }}>Checkin</th>
                <th style={{ padding: '12px' }}>Checkout</th>
                <th style={{ padding: '12px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(Array.isArray(reservations) ? reservations : []).map((r) => (
                <tr key={r._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px', color: '#222' }}>{
                    r.user
                      ? (r.user.includes('@') ? r.user.split('@')[0] : r.user)
                      : (r.guest ? (r.guest.includes('@') ? r.guest.split('@')[0] : r.guest) : '-')
                  }</td>
                  <td style={{ padding: '12px', color: '#222' }}>{r.listingName || r.property || '-'}</td>
                  <td style={{ padding: '12px', color: '#222' }}>{r.checkIn ? new Date(r.checkIn).toLocaleDateString() : (r.checkin ? new Date(r.checkin).toLocaleDateString() : '-')}</td>
                  <td style={{ padding: '12px', color: '#222' }}>{r.checkOut ? new Date(r.checkOut).toLocaleDateString() : (r.checkout ? new Date(r.checkout).toLocaleDateString() : '-')}</td>
                  <td style={{ padding: '12px' }}>
                    <button
                      style={{
                        background: '#d32f2f',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '8px 24px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                      }}
                      onClick={() => handleDelete(r._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ViewReservations;
