
import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload';
const CLOUDINARY_UPLOAD_PRESET = 'YOUR_UPLOAD_PRESET';

const CreateListing = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
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
    if (!form.title || !form.description || !form.price || !form.image) {
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
        title: form.title,
        description: form.description,
        price: form.price,
        imageUrl: cloudData.secure_url
      };
      const res = await fetch(`${import.meta.env.VITE_API_URL}/listings/new`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(listing)
      });
      if (!res.ok) {
        toast.error('Failed to create listing.');
      } else {
        toast.success('Listing created successfully!');
        setForm({ title: '', description: '', price: '', image: null });
      }
    } catch (err) {
      toast.error('Error creating listing.');
    }
    setLoading(false);
  };

  return (
    <div className="create-listing-container">
      <h1>Create Listing</h1>
      <form className="create-listing-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
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
          name="price"
          placeholder="Price"
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
