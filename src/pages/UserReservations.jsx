
import { API_URL } from '../constants';
import { useEffect, useState } from "react";
import './Admin/Create/ListCard.css';

const UserReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [listings, setListings] = useState([]);

  useEffect(() => {
    // Fetch all listings for lookup
    const fetchListings = async () => {
      try {
        const res = await fetch(`${API_URL}/listings`);
        const data = await res.json();
        let listingsArr = [];
        if (Array.isArray(data)) listingsArr = data;
        else if (data && Array.isArray(data.data)) listingsArr = data.data;
        else if (data && Array.isArray(data.listings)) listingsArr = data.listings;
        setListings(listingsArr);
      } catch (error) {
        console.error('Failed to fetch listings:', error);
      }
    };
    fetchListings();
  }, []);

  useEffect(() => {
    const fetchReservations = async () => {
      const userData = localStorage.getItem('airbnb_user');
      try {
        const res = await fetch(`${API_URL}/reservations?user=${encodeURIComponent(JSON.parse(userData)?.username || '')}`);
        const result = await res.json();
        let reservationsArr = [];
        if (Array.isArray(result)) {
          reservationsArr = result;
        } else if (result && Array.isArray(result.data)) {
          reservationsArr = result.data;
        } else if (result && Array.isArray(result.reservations)) {
          reservationsArr = result.reservations;
        } else if (result && typeof result === 'object' && result.data) {
          reservationsArr = [result.data];
        }
        setReservations(reservationsArr);
      } catch (err) {
        console.error('Failed to fetch reservations:', err);
        setReservations([]);
      }
    };
    fetchReservations();
  }, []);
  // Dynamically get all unique keys from reservations
  // Show only user-friendly columns in a specific order
  const allKeys = [
    'listingName',
    'type',
    'location',
    'location2',
    'description',
    'rooms',
    'beds',
    'baths',
    'guests',
    'amenities',
    'rating',
    'reviews',
    'price',
    'checkIn',
    'checkOut',
    'images',
  ];

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
                {allKeys.map((key) => {
                  let label = '';
                  switch (key) {
                    case 'listingName': label = 'Listing Name'; break;
                    case 'type': label = 'Type'; break;
                    case 'location': label = 'Location'; break;
                    case 'location2': label = 'Region'; break;
                    case 'description': label = 'Description'; break;
                    case 'rooms': label = 'Rooms'; break;
                    case 'beds': label = 'Beds'; break;
                    case 'baths': label = 'Baths'; break;
                    case 'guests': label = 'Guests'; break;
                    case 'amenities': label = 'Amenities'; break;
                    case 'rating': label = 'Rating'; break;
                    case 'reviews': label = 'Reviews'; break;
                    case 'price': label = 'Price'; break;
                    case 'checkIn': label = 'Check-in'; break;
                    case 'checkOut': label = 'Check-out'; break;
                    case 'images': label = 'Images'; break;
                    default: label = key.charAt(0).toUpperCase() + key.slice(1);
                  }
                  return (
                    <th key={key} style={{ padding: '12px', borderBottom: '1px solid #eee', textTransform: 'capitalize' }}>{label}</th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {(Array.isArray(reservations) ? reservations : []).map((res, idx) => {
                // Try to find the matching listing by id first, then by name
                const match = listings.find(l => l._id === res.listingId) || listings.find(l => l.listingName === res.listingName);
                return (
                  <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                    {allKeys.map((key) => {
                      let value = res[key];
                      // Always use the listing's value from the server for all fields if available
                      if (match) {
                        if (key === 'listingName') value = match.listingName;
                        else if (key === 'images') value = match.images;
                        else if (match[key] !== undefined && match[key] !== null && match[key] !== "") value = match[key];
                      }
                      return (
                        <td key={key} style={{
                          padding: '10px',
                          textAlign: key === 'images' ? 'center' : 'left',
                          maxWidth: key === 'description' ? 200 : undefined,
                          whiteSpace: key === 'description' ? 'nowrap' : undefined,
                          overflow: key === 'description' ? 'hidden' : undefined,
                          textOverflow: key === 'description' ? 'ellipsis' : undefined
                        }}>
                          {key === 'amenities' && Array.isArray(value) ? value.join(', ')
                            : key === 'images' && Array.isArray(value) ? (
                                value.length > 0 ? value.map((img, i) => (
                                  <img key={i} src={img} alt="listing" style={{ width: '60px', height: '60px', borderRadius: '8px', marginRight: 4, objectFit: 'cover', aspectRatio: '1 / 1' }} />
                                )) : '-' 
                              )
                            : (value ?? '-')}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserReservations;
