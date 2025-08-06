import React, { useEffect, useState } from 'react';
import { API_URL } from '../constants';
import { useNavigate, useLocation } from 'react-router-dom';
import "./ViewListings.css";

const ViewListings = () => {
  const [listings, setListings] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [locationNames, setLocationNames] = useState([]);
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("");
  const navigate = useNavigate();
  const urlLocation = useLocation();

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/listings`)
      .then(res => res.json())
      .then(result => {
        let listingsArr = [];
        if (Array.isArray(result)) {
          listingsArr = result;
        } else if (result && Array.isArray(result.data)) {
          listingsArr = result.data;
        } else if (result && Array.isArray(result.listings)) {
          listingsArr = result.listings;
        }
        setListings(listingsArr);
        // For quick search dropdown
        const names = Array.from(new Set((listingsArr).map(l => l.listingName || l.location).filter(Boolean)));
        setLocationNames(names);
        if (listingsArr.length === 0) setError('No listings found.');
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Unable to fetch listings. Please check your backend connection.');
        setLoading(false);
      });
  }, []);

  // Sync filters from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(urlLocation.search);
    setLocation(params.get('location') || "");
    setCheckIn(params.get('checkIn') || "");
    setCheckOut(params.get('checkOut') || "");
    setGuests(params.get('guests') || "");
  }, [urlLocation.search]);

  const handleQuickSearch = () => {
    const params = [];
    if (location && location !== "select" && location !== "all") params.push(`location=${encodeURIComponent(location)}`);
    if (checkIn) params.push(`checkIn=${encodeURIComponent(checkIn)}`);
    if (checkOut) params.push(`checkOut=${encodeURIComponent(checkOut)}`);
    if (guests) params.push(`guests=${encodeURIComponent(guests)}`);
    const query = params.length ? `?${params.join("&")}` : "";
    navigate(`/listing${query}`);
  };

  const [favourites, setFavourites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('favourites')) || [];
    } catch {
      return [];
    }
  });

  const handleSaveClick = (listing) => {
    // Add to favourites in state and localStorage
    if (!favourites.some(fav => fav._id === listing._id)) {
      const newFavs = [...favourites, listing];
      setFavourites(newFavs);
      localStorage.setItem('favourites', JSON.stringify(newFavs));
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

  if (loading) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 0', textAlign: 'center', fontSize: '1.2rem', color: '#ff385c' }}>
        Loading listings...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 0' }}>
      {/* Quick Search Bar */}
      <div className="searchbar" style={{ marginBottom: 32 }}>
        <div className="searchbar-group">
          <label className="searchbar-label">Hotels</label>
          <select className="searchbar-select" value={location} onChange={e => setLocation(e.target.value)}>
            <option value="select">Select a Location</option>
            <option value="all">All Locations</option>
            {locationNames.map((loc, idx) => (
              <option key={idx} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
        <div className="searchbar-divider" />
        <div className="searchbar-group">
          <label className="searchbar-label">
            Check in<br />
            <input type="date" className="searchbar-input" value={checkIn} onChange={e => setCheckIn(e.target.value)} />
          </label>
        </div>
        <div className="searchbar-divider" />
        <div className="searchbar-group">
          <label className="searchbar-label">
            Check out<br />
            <input type="date" className="searchbar-input" value={checkOut} onChange={e => setCheckOut(e.target.value)} />
          </label>
        </div>
        <div className="searchbar-divider" />
        <div className="searchbar-group">
          <label className="searchbar-label">
            Guests<br />
            <input type="number" min="1" className="searchbar-input" value={guests} onChange={e => setGuests(e.target.value)} placeholder="Add guests" />
          </label>
        </div>
        <button type="button" className="searchbar-btn" onClick={handleQuickSearch}>Search</button>
      </div>
      {/* ...existing code... */}
      <div style={{ width: '100%', marginTop: '24px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <h3 style={{ color: '#000' }}>Hotel Listings</h3>
        {error && <div style={{ color: 'red', marginBottom: '12px' }}>{error}</div>}
        {listings.length === 0 && !error ? <div>No listings to show.</div> : null}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', width: '100%' }}>
          {(Array.isArray(listings) ? listings.filter(l => l && typeof l === 'object') : []).map((listing) => (
            <div key={listing && listing._id ? listing._id : Math.random()} className="hotel-card" style={{ cursor: 'pointer' }} onClick={() => handleCardClick(listing._id)}>
              <div className="hotel-card-left">
                <img
                  src={
                    listing.images && Array.isArray(listing.images) && listing.images[0]
                      ? listing.images[0].startsWith('http')
                        ? listing.images[0]
                        : `/assets/images/${listing.images[0]}`
                      : 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=500&auto=format&fit=crop&q=60'
                  }
                  alt="listing-image"
                  className="hotel-card-image"
                  style={{ width: '80px', height: '80px', objectFit: 'cover', aspectRatio: '1 / 1', borderRadius: '8px' }}
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
                <button className="save-btn" onClick={() => handleSaveClick(listing)} disabled={favourites.some(fav => fav._id === listing._id)}>
                  {favourites.some(fav => fav._id === listing._id) ? 'Saved' : 'Save'}
                </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewListings;
