import React, { useEffect, useState } from 'react';
import { API_URL } from '../../../constants';
import './ListCard.css';


const ListCard = () => {
  const [reservations, setReservations] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const [resRes, listRes] = await Promise.all([
          fetch(`${API_URL}/reservations`),
          fetch(`${API_URL}/listings`)
        ]);
        const resResult = await resRes.json();
        const listResult = await listRes.json();
        if (!resResult.success) throw new Error(resResult.error || 'Unable to fetch reservations.');
        let listingsArr = [];
        if (Array.isArray(listResult)) listingsArr = listResult;
        else if (listResult && Array.isArray(listResult.data)) listingsArr = listResult.data;
        else if (listResult && Array.isArray(listResult.listings)) listingsArr = listResult.listings;
        setReservations(Array.isArray(resResult.data) ? resResult.data : []);
        setListings(listingsArr);
      } catch (err) {
        setError(err.message || 'Unable to fetch reservations.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading reservations...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div className="card-list">
      {reservations.length === 0 ? (
        <div>No reservations found.</div>
      ) : (
        reservations.map((res, idx) => {
          // Find the matching listing by id or name
          const match = listings.find(l => l._id === res.listingId) || listings.find(l => l.listingName === res.listingName);
          return (
            <div className="card-container" key={res._id || idx}>
              <div className="card-left">
                <img
                  src={
                    (match && Array.isArray(match.images) && match.images[0]) ? match.images[0] :
                    res.image || "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=500&auto=format&fit=crop&q=60"
                  }
                  alt="listing-image"
                  className="listing-image"
                />
              </div>
              <div className="card-right">
                <h3 className="listing-location">{match ? match.listingName : (res.listingName || res.property || '-')}</h3>
                <p className="listing-info">Guest: {res.guest || '-'}</p>
                <p className="listing-info">Check-in: {res.checkin || '-'}</p>
                <p className="listing-info">Check-out: {res.checkout || '-'}</p>
                {match && match.amenities && Array.isArray(match.amenities) ? (
                  <div className="listing-Amenities">
                    <ul>
                      {match.amenities.map((a, i) => <li key={i}>{a}</li>)}
                    </ul>
                  </div>
                ) : res.amenities && Array.isArray(res.amenities) ? (
                  <div className="listing-Amenities">
                    <ul>
                      {res.amenities.map((a, i) => <li key={i}>{a}</li>)}
                    </ul>
                  </div>
                ) : null}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default ListCard;
