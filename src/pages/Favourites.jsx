import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../constants";

const Favourites = () => {
  const [favourites, setFavourites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Read favourites from localStorage
    const favs = JSON.parse(localStorage.getItem('favourites') || '[]');
    setFavourites(Array.isArray(favs) ? favs : []);
  }, []);

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px 0" }}>
      <h2 style={{ color: "#ff385c", marginBottom: "24px" }}>Favourites</h2>
      {favourites.length === 0 ? (
        <p style={{ color: "#888" }}>No favourites added yet.</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '32px',
        }}>
          {favourites.map((fav) => (
            <div
              key={fav._id}
              onClick={() => navigate(`/listing/${fav._id}`)}
              style={{
                cursor: 'pointer',
                border: '1px solid #eee',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                background: '#fff',
                transition: 'box-shadow 0.2s',
              }}
            >
              <div style={{ width: '100%', aspectRatio: '1/1', overflow: 'hidden', background: '#f7f7f7' }}>
                <img
                  src={fav.images && fav.images[0] ? (fav.images[0].startsWith("http") ? fav.images[0] : `/assets/images/${fav.images[0]}`) : "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=500&auto=format&fit=crop&q=60"}
                  alt={fav.listingName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
              <div style={{ padding: '16px' }}>
                <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: 4 }}>{fav.listingName}</div>
                <div style={{ color: '#ff385c', fontWeight: 500, marginBottom: 4 }}>{fav.location}</div>
                <div style={{ color: '#888', fontSize: '0.95rem' }}>{fav.type || (fav.beds ? fav.beds + ' beds' : '')}</div>
                <div style={{ color: '#222', fontWeight: 600, marginTop: 8 }}>₦{fav.price}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favourites;
