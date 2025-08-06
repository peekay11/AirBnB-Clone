

import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_URL, CLOUDINARY_URL, CLOUDINARY_UPLOAD_PRESET } from '../constants';

const CreateListing = () => {
  const [form, setForm] = useState({
    listingName: '',
    type: '',
    location: '',
    location2: '',
    description: '',
    rooms: '',
    beds: '',
    baths: '',
    guests: '',
    amenities: '', // comma separated string
    price: '',
    image: null
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.listingName || !form.type || !form.location || !form.description || !form.rooms || !form.beds || !form.baths || !form.guests || !form.amenities || !form.price || !form.image) {
      toast.error('Please fill all fields and select an image.');
      return;
    }
    setLoading(true);
    try {
      // Upload image to Cloudinary
      const data = new FormData();
      data.append('file', form.image);
      data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      const cloudRes = await fetch(CLOUDINARY_URL, {
        method: 'POST',
        body: data
      });
      const cloudData = await cloudRes.json();
      if (!cloudData.secure_url) {
        toast.error('Image upload failed.');
        setLoading(false);
        return;
      }
      // Post listing to backend
      const listing = {
        listingName: form.listingName,
        type: form.type,
        location: form.location,
        location2: form.location2,
        description: form.description,
        rooms: form.rooms,
        beds: form.beds,
        baths: form.baths,
        guests: form.guests,
        amenities: form.amenities.split(',').map(a => a.trim()).filter(Boolean),
        price: form.price,
        images: [cloudData.secure_url],
        rating: 0,
        reviews: 0
      };
      const res = await fetch(`${API_URL}/listings/new`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(listing)
      });
      if (!res.ok) {
        toast.error('Failed to create listing.');
      } else {
        toast.success('Listing created successfully!');
        setForm({
          listingName: '',
          type: '',
          location: '',
          location2: '',
          description: '',
          rooms: '',
          beds: '',
          baths: '',
          guests: '',
          amenities: '',
          price: '',
          image: null
        });
      }
    } catch {
      toast.error('Error creating listing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-listing-container">
      <h1>Create Listing</h1>
      <form className="create-listing-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="listingName"
          placeholder="Listing Name"
          value={form.listingName}
          onChange={handleChange}
        />
        <input
          type="text"
          name="type"
          placeholder="Type (e.g. Apartment, Cottage)"
          value={form.type}
          onChange={handleChange}
        />
        <input
          type="text"
          name="location"
          placeholder="Location (City)"
          value={form.location}
          onChange={handleChange}
        />
        <input
          type="text"
          name="location2"
          placeholder="Location 2 (Area, optional)"
          value={form.location2}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />
        <input
          type="number"
          name="rooms"
          placeholder="Rooms"
          value={form.rooms}
          onChange={handleChange}
        />
        <input
          type="number"
          name="beds"
          placeholder="Beds"
          value={form.beds}
          onChange={handleChange}
        />
        <input
          type="number"
          name="baths"
          placeholder="Baths"
          value={form.baths}
          onChange={handleChange}
        />
        <input
          type="number"
          name="guests"
          placeholder="Guests"
          value={form.guests}
          onChange={handleChange}
        />
        <input
          type="text"
          name="amenities"
          placeholder="Amenities (comma separated)"
          value={form.amenities}
          onChange={handleChange}
        />
        <input
          type="text"
          name="price"
          placeholder="Price (e.g. R500 / night)"
          value={form.price}
          onChange={handleChange}
        />
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Listing'}
        </button>
      </form>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default CreateListing;
