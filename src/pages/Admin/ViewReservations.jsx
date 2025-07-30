import React, { useState, useEffect } from 'react';
import './ViewReservations.css';

const MOCK_RESERVATIONS = [
  {
    id: 'r1',
    guest: 'Johann Coetzee',
    property: 'Property 1',
    checkin: '19/06/2024',
    checkout: '24/06/2024',
  },
  {
    id: 'r2',
    guest: 'Asif Hassam',
    property: 'Property 2',
    checkin: '19/06/2024',
    checkout: '19/06/2024',
  },
  {
    id: 'r3',
    guest: 'Kago Kola',
    property: 'Property 1',
    checkin: '25/06/2024',
    checkout: '30/06/2024',
  },
];

const ViewReservations = () => {
  const [reservations, setReservations] = useState([]);
  useEffect(() => {
    setReservations(MOCK_RESERVATIONS);
  }, []);

  const handleDelete = (id) => {
    setReservations(prev => prev.filter(r => r.id !== id));
  };
  return (
    <div style={{ display: 'flex', maxWidth: '1200px', margin: '0 auto', padding: '32px 0' }}>
      <div style={{ flex: 1, paddingLeft: '32px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '32px', color: '#222' }}>
          View Reservations ({reservations.length})
        </h2>
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
            {reservations.map((r) => (
              <tr key={r.id} style={{ borderBottom: '1px solid #eee' }}>
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
                    onClick={() => handleDelete(r.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewReservations;
