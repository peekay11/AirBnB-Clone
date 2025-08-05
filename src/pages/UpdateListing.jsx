import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Admin/CreateListing.css';

const UpdateListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [amenity, setAmenity] = useState('');
  const handleAddAmenity = () => {
    if (amenity) {
      setListing(prev => ({ ...prev, amenities: [...(prev.amenities || []), amenity] }));
      setAmenity('');
    }
  };

  const handleRemoveAmenity = (idx) => {
    setListing(prev => ({ ...prev, amenities: prev.amenities.filter((_, i) => i !== idx) }));
  };
  const handleImageUpload = (e) => {
    setListing(prev => ({ ...prev, images: [...(prev.images || []), ...Array.from(e.target.files).map(img => img.name || 'Image uploaded')] }));
  };

  const handleRemoveImage = (idx) => {
    setListing(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/listings/${id}`)
      .then(res => res.json())
      .then(result => {
        if (!result.success) throw new Error(result.error || 'Listing not found');
        setListing(result.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Listing not found');
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setListing(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/listings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(listing),
      });
      const result = await res.json().catch(() => ({}));
      if (!res.ok || (result && result.error)) throw new Error(result.error || 'Failed to update listing');
      navigate('/listings');
    } catch (err) {
      setError('Failed to update listing.' + (err?.message ? ' ' + err.message : ''));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!listing) return <div>Listing not found.</div>;

  return (
    <div className="create-listing-container">
      <h2 className="create-listing-title">Update Listing</h2>
      <form className="create-listing-form" onSubmit={handleSubmit}>
        <div className="create-listing-row">
          <div style={{ flex: 1 }}>
            <label className="create-listing-label">Listing Name</label>
            <input name="listingName" value={listing.listingName || ''} onChange={handleChange} className="create-listing-input" />
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
            <div>
              <label className="create-listing-label">Rooms</label>
              <input name="rooms" type="number" value={listing.rooms || ''} onChange={handleChange} className="create-listing-input" style={{ width: '50px' }} />
            </div>
            <div>
              <label className="create-listing-label">Baths</label>
              <input name="baths" type="number" value={listing.baths || ''} onChange={handleChange} className="create-listing-input" style={{ width: '50px' }} />
            </div>
            <div>
              <label className="create-listing-label">Type</label>
              <select name="type" value={listing.type || ''} onChange={handleChange} className="create-listing-select" style={{ width: '120px' }}>
                <option value="">Select</option>
                <option value="Apartment">Apartment</option>
                <option value="House">House</option>
                <option value="Hotel">Hotel</option>
              </select>
            </div>
          </div>
        </div>
        <div className="create-listing-row">
          <div style={{ flex: 1 }}>
            <label className="create-listing-label">Location</label>
            <input name="location" type="text" value={listing.location || ''} onChange={handleChange} className="create-listing-input" />
          </div>
          <div style={{ flex: 1 }}>
            <label className="create-listing-label">Location2</label>
            <input name="location2" type="text" value={listing.location2 || ''} onChange={handleChange} className="create-listing-input" />
          </div>
        </div>
        <div className="create-listing-row">
          <div style={{ flex: 1 }}>
            <label className="create-listing-label">Description</label>
            <textarea name="description" value={listing.description || ''} onChange={handleChange} className="create-listing-textarea" />
          </div>
          <div style={{ flex: 1 }}>
            <label className="create-listing-label">Amenities</label>
            <div className="create-listing-amenities">
              <input type="text" value={amenity} onChange={e => setAmenity(e.target.value)} className="create-listing-input" style={{ width: '60%' }} />
              <button type="button" onClick={handleAddAmenity} className="create-listing-btn" style={{ padding: '8px 24px', background: '#3b5bfd', color: '#fff', borderRadius: '4px', border: 'none' }}>Add</button>
            </div>
            <ul className="create-listing-amenity-list">
              {Array.isArray(listing.amenities) ? listing.amenities.map((a, i) => (
                <li key={i}>
                  {a} <button type="button" style={{ marginLeft: 8, color: '#d32f2f', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => handleRemoveAmenity(i)}>×</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div>
          <label className="create-listing-label">Images</label>
          <input type="file" multiple onChange={handleImageUpload} className="create-listing-image-upload" />
          <div className="create-listing-image-preview">
            {Array.isArray(listing.images) && listing.images.length > 0 ? listing.images.map((img, i) => (
              <span key={i} style={{ display: 'inline-block', position: 'relative', marginRight: '12px' }}>
                <span>{img}</span>
                <button type="button" onClick={() => handleRemoveImage(i)} style={{ position: 'absolute', top: 0, right: 0, background: '#d32f2f', color: '#fff', border: 'none', borderRadius: '50%', width: '22px', height: '22px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', lineHeight: '22px', padding: 0 }}>×</button>
              </span>
            )) : null}
          </div>
        </div>
        {error && <div style={{ color: 'red', marginBottom: '12px' }}>{error}</div>}
        <div className="create-listing-actions">
          <button type="submit" className="create-listing-btn" disabled={loading}>{loading ? 'Updating...' : 'Update'}</button>
          <button type="button" className="create-listing-btn cancel" onClick={() => navigate('/listings')}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default UpdateListing;
