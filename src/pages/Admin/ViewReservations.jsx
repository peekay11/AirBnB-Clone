import React, { useState, useEffect } from 'react';
import './ViewReservations.css';

const ViewReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/reservations`)
      .then(res => res.json())
      .then(result => {
        if (!result.success) {
          throw new Error(result.error || 'Unable to fetch reservations.');
        }
        setReservations(Array.isArray(result.data) ? result.data : []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Unable to fetch reservations. Please check your backend connection.');
        setLoading(false);
      });
  }, []);

  const handleDelete = (id) => {
    fetch(`${import.meta.env.VITE_API_URL}/reservations/${id}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(result => {
        if (!result.success) {
          throw new Error(result.error || 'Failed to delete reservation');
        }
        setReservations(prev => prev.filter(r => r._id !== id));
      })
      .catch((err) => {
        setError(err.message || 'Failed to delete reservation.');
        
      });
  };
  return (
    <div style={{ display: 'flex', maxWidth: '1200px', margin: '0 auto', padding: '32px 0' }}>
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
                  <td style={{ padding: '12px', color: '#222' }}>{r.guest}</td>
                  <td style={{ padding: '12px', color: '#222' }}>{r.property}</td>
                  <td style={{ padding: '12px', color: '#222' }}>{r.checkin}</td>
                  <td style={{ padding: '12px', color: '#222' }}>{r.checkout}</td>
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
