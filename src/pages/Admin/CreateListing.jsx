import React, { useState } from 'react';
import './CreateListing.css';

const CreateListing = () => {
  const [listingName, setListingName] = useState('');
  const [rooms, setRooms] = useState('');
  const [baths, setBaths] = useState('');
  const [beds, setBeds] = useState('');
  const [guests, setGuests] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState('');
  const [location, setLocation] = useState('');
  const [location2, setLocation2] = useState('');
  const [description, setDescription] = useState('');
  const [amenities, setAmenities] = useState([]);
  const amenityOptions = [
    "WiFi", "Kitchen", "Free Parking", "Heating", "Washer", "Coffee maker", "Air conditioning", "Private patio", "Pool", "Breakfast"
  ];
  const [selectedAmenity, setSelectedAmenity] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleAddAmenity = () => {
    if (selectedAmenity && !amenities.includes(selectedAmenity)) {
      setAmenities([...amenities, selectedAmenity]);
      setSelectedAmenity("");
    }
  };

  const handleImageUpload = (e) => {
    setImages([...images, ...Array.from(e.target.files)]);
  };

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const randomRating = (Math.random() * 1 + 4).toFixed(1); // 4.0 - 5.0
      const randomReviews = Math.floor(Math.random() * 300) + 50; // 50 - 349
      const newListing = {
        listingName,
        rooms,
        baths,
        beds,
        guests,
        rating: randomRating,
        reviews: randomReviews,
        price,
        type,
        location,
        location2,
        description,
        amenities,
        images: images.map(img => img.name || 'Image uploaded'),
      };
      const res = await fetch(`${import.meta.env.VITE_API_URL}/listings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newListing),
      });
      if (!res.ok) throw new Error('Failed to add listing');
      // Reset form
      setListingName(''); setRooms(''); setBaths(''); setType(''); setLocation(''); setLocation2(''); setDescription(''); setAmenities([]); setImages([]);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-listing-container">
      <h2 className="create-listing-title">Create Listing</h2>
      <form className="create-listing-form" onSubmit={handleSubmit}>
        <>
          <div className="create-listing-row">
            <div style={{ flex: 1 }}>
              <label className="create-listing-label">Listing Name</label>
              <input type="text" value={listingName} onChange={e => setListingName(e.target.value)} className="create-listing-input" />
            </div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
              <div>
                <label className="create-listing-label">Rooms</label>
                <input type="number" value={rooms} onChange={e => setRooms(e.target.value)} className="create-listing-input" style={{ width: '50px' }} />
              </div>
              <div>
                <label className="create-listing-label">Baths</label>
                <input type="number" value={baths} onChange={e => setBaths(e.target.value)} className="create-listing-input" style={{ width: '50px' }} />
              </div>
              <div>
                <label className="create-listing-label">Beds</label>
                <input type="number" value={beds} onChange={e => setBeds(e.target.value)} className="create-listing-input" style={{ width: '50px' }} />
              </div>
              <div>
                <label className="create-listing-label">Guests</label>
                <input type="text" value={guests} onChange={e => setGuests(e.target.value)} className="create-listing-input" style={{ width: '60px' }} />
              </div>
              {/* Rating is now randomly generated on submit */}
              <div>
                <label className="create-listing-label">Price</label>
                <input type="text" value={price} onChange={e => setPrice(e.target.value)} className="create-listing-input" style={{ width: '80px' }} />
              </div>
              <div>
                <label className="create-listing-label">Type</label>
                <select value={type} onChange={e => setType(e.target.value)} className="create-listing-select" style={{ width: '120px' }}>
                  <option value="">Select</option>
                  <option value="Apartment">Apartment</option>
                  <option value="House">House</option>
                  <option value="Hotel">Hotel</option>
                  <option value="Villa">Villa</option>
                  <option value="Cottage">Cottage</option>
                </select>
              </div>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <label className="create-listing-label">Location</label>
            <input type="text" value={location} onChange={e => setLocation(e.target.value)} className="create-listing-input" />
          </div>
          <div style={{ flex: 1 }}>
            <label className="create-listing-label">Location</label>
            <input type="text" value={location2} onChange={e => setLocation2(e.target.value)} className="create-listing-input" />
          </div>
          <div className="create-listing-row">
            <div style={{ flex: 1 }}>
              <label className="create-listing-label">Discription</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} className="create-listing-textarea" />
            </div>
            <div style={{ flex: 1 }}>
              <label className="create-listing-label">Amenities</label>
              <div className="create-listing-amenities" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                {amenityOptions.map(opt => (
                  <button
                    key={opt}
                    type="button"
                    style={{
                      borderRadius: 20,
                      marginRight: 4,
                      padding: '0.25rem 1.2rem',
                      border: '1px solid #ddd',
                      background: selectedAmenity === opt ? '#ff385c' : '#fff',
                      color: selectedAmenity === opt ? '#fff' : '#222',
                      fontWeight: selectedAmenity === opt ? 'bold' : 'normal',
                      fontSize: '0.95rem',
                      height: '32px',
                      whiteSpace: 'nowrap',
                    }}
                    onClick={() => setSelectedAmenity(selectedAmenity === opt ? "" : opt)}
                  >{opt}</button>
                ))}
                <button
                  type="button"
                  className="create-listing-btn"
                  style={{ padding: '8px 24px', background: '#3b5bfd', color: '#fff', borderRadius: '4px', border: 'none', fontWeight: 'bold' }}
                  onClick={handleAddAmenity}
                  disabled={!selectedAmenity || amenities.includes(selectedAmenity)}
                >Add</button>
              </div>
              <ul className="create-listing-amenity-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', listStyle: 'none', padding: 0 }}>
                {amenities.map((a, i) => (
                  <li key={i} style={{
                    borderRadius: 20,
                    padding: '0.25rem 1.2rem',
                    border: '1px solid #ddd',
                    background: '#ff385c',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '0.95rem',
                    height: '32px',
                    whiteSpace: 'nowrap',
                    marginRight: 4,
                  }}>{a}</li>
                ))}
              </ul>
            </div>
          </div>
          <div>
            <label className="create-listing-label">Images</label>
            <input type="file" multiple onChange={handleImageUpload} className="create-listing-image-upload" />
            <div className="create-listing-image-preview">
              {images.length > 0 ? images.map((img, i) => (
                <span key={i} style={{ display: 'inline-block', position: 'relative', marginRight: '12px' }}>
                  {img.type && img.type.startsWith('image') ? (
                    <img src={URL.createObjectURL(img)} alt={img.name || 'Image'} style={{ maxWidth: '80px', maxHeight: '80px', borderRadius: '6px', border: '1px solid #ccc' }} />
                  ) : (
                    <span>{img.name || 'Image uploaded'}</span>
                  )}
                  <button type="button" onClick={() => handleRemoveImage(i)} style={{ position: 'absolute', top: 0, right: 0, background: '#d32f2f', color: '#fff', border: 'none', borderRadius: '50%', width: '22px', height: '22px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', lineHeight: '22px', padding: 0 }}>×</button>
                </span>
              )) : null}
            </div>
          </div>
          {error && <div style={{ color: 'red', marginBottom: '12px' }}>{error}</div>}
          {success && (
            <div style={{
              color: '#fff',
              background: '#4caf50',
              padding: '12px 24px',
              borderRadius: '8px',
              marginBottom: '12px',
              fontWeight: 'bold',
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
              position: 'fixed',
              top: '32px',
              right: '32px',
              zIndex: 9999,
            }}>
              Listing created successfully!
              <button style={{ marginLeft: 16, background: 'transparent', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.2rem' }} onClick={() => setSuccess(false)}>×</button>
            </div>
          )}
          <div className="create-listing-actions">
            <button type="submit" className="create-listing-btn" disabled={loading}>{loading ? 'Creating...' : 'Create'}</button>
            <button type="button" className="create-listing-btn cancel" onClick={() => {/* reset logic */}}>Cancel</button>
          </div>
        </>
      </form>
    </div>
  );
};

export default CreateListing;
