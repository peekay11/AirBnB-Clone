import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Favourites = () => {
  const [favourites, setFavourites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/favourites`)
      .then(res => res.json())
      .then(data => setFavourites(data))
      .catch(() => setFavourites([]));
  }, []);

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "32px 0" }}>
      <h2 style={{ color: "#ff385c", marginBottom: "24px" }}>Favourites</h2>
      {favourites.length === 0 ? (
        <p style={{ color: "#888" }}>No favourites added yet.</p>
      ) : (
        <table className="favourites-table" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: '#ff5a5f', color: 'white' }}>
              <th style={{ padding: "8px", border: "1px solid #ddd" }}>Image</th>
              <th style={{ padding: "8px", border: "1px solid #ddd" }}>Name</th>
              <th style={{ padding: "8px", border: "1px solid #ddd" }}>Location</th>
              <th style={{ padding: "8px", border: "1px solid #ddd" }}>Type</th>
              <th style={{ padding: "8px", border: "1px solid #ddd" }}>Price</th>
            </tr>
          </thead>
          <tbody>
            {(Array.isArray(favourites) ? favourites : []).map((fav) => (
              <tr key={fav._id} onClick={() => navigate(`/listing/${fav._id}`)} style={{ cursor: 'pointer', border: "1px solid #ddd" }}>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                  <img src={fav.images && fav.images[0] ? (fav.images[0].startsWith("http") ? fav.images[0] : `/assets/images/${fav.images[0]}`) : "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=500&auto=format&fit=crop&q=60"} alt={fav.listingName} style={{ width: '60px', borderRadius: '8px' }} />
                </td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>{fav.listingName}</td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>{fav.location}</td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>{fav.type || fav.beds + ' beds'}</td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>{fav.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Favourites;
