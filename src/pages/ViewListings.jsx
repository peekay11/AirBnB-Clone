
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./ViewListings.css";

const ViewListings = () => {
  const [listings, setListings] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/listings`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch listings');
        return res.json();
      })
      .then(data => {
        setListings(data);
        if (data.length === 0) {
          setError('No listings found.');
        }
      })
      .catch(() => {
        setError('Unable to fetch listings. Please check your backend connection.');
      });
  }, []);

  const [favourites, setFavourites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('favourites')) || [];
    } catch {
      return [];
    }
  });

  const handleSaveClick = (listing) => {
    // Add to favourites in localStorage
    const favourites = JSON.parse(localStorage.getItem('favourites')) || [];
    // Avoid duplicates
    if (!favourites.some(fav => fav._id === listing._id)) {
      favourites.push(listing);
      localStorage.setItem('favourites', JSON.stringify(favourites));
    }
  };
  const handleCardClick = (id) => {
    navigate(`/listing/${id}`);
  };

  const handleHeaderClick = (listing) => {
    // Add to favourites if not already present
    if (!favourites.some(fav => fav._id === listing._id)) {
      const newFavs = [...favourites, listing];
      setFavourites(newFavs);
      localStorage.setItem('favourites', JSON.stringify(newFavs));
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 0' }}>
      <div style={{ width: '100%', marginTop: '24px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <h3 style={{ color: '#000' }}>Hotel Listings</h3>
        {error && <div style={{ color: 'red', marginBottom: '12px' }}>{error}</div>}
        {listings.length === 0 && !error ? <div>No listings to show.</div> : null}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', width: '100%' }}>
          {listings.map((listing) => (
            <div key={listing._id} className="hotel-card" style={{ cursor: 'pointer' }} onClick={() => handleCardClick(listing._id)}>
              <div className="hotel-card-left">
                <img
                  src={
                    listing.images && listing.images[0]
                      ? listing.images[0].startsWith('http')
                        ? listing.images[0]
                        : `/assets/images/${listing.images[0]}`
                      : 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=500&auto=format&fit=crop&q=60'
                  }
                  alt="listing-image"
                  className="hotel-card-image"
                />
              </div>
              <div className="hotel-card-right">
                <div
                  className={`hotel-card-header${favourites.some(fav => fav._id === listing._id) ? ' pink-header' : ''}`}
                  onClick={e => {
                    e.stopPropagation();
                    handleHeaderClick(listing);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <span className="hotel-card-subtitle">
                    {listing.guests ? `${listing.guests} guests` : `${listing.rooms || ''} Room Bedroom`}
                  </span>
                  <h2 className="hotel-card-title">{listing.listingName}</h2>
                </div>
                <div className="hotel-card-details">
                  <span>
                    {listing.type ? `${listing.type} - ` : ''}{listing.location}
                    {listing.location2 ? ` - ${listing.location2}` : ''}
                  </span>
                  <span>
                    {listing.guests ? `${listing.guests} guests` : ''}
                    {listing.beds ? ` · ${listing.beds} beds` : ''}
                    {listing.baths ? ` · ${listing.baths} bath` : ''}
                  </span>
                  <span>{listing.amenities && listing.amenities.length > 0 ? listing.amenities.join(' · ') : 'No amenities listed'}</span>
                </div>
                <div className="hotel-card-footer">
                  <div className="hotel-card-rating">
                    {listing.rating && (
                      <span>{listing.rating} <span role="img" aria-label="star">⭐</span></span>
                    )}
                    {listing.reviews && (
                      <span className="hotel-card-reviews">({listing.reviews} reviews)</span>
                    )}
                  </div>
                  <div className="hotel-card-price">
                    <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{listing.price || ''}</span>
                  </div>
                </div>
              </div>
                <button className="save-btn" onClick={() => handleSaveClick(listing)}>
                  Save
                </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewListings;
