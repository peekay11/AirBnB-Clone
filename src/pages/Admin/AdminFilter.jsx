import React from 'react'
import { useNavigate } from 'react-router-dom';
import './AdminFilter.css'
const AdminFilter = () => {
  const navigate = useNavigate();
  return (
    <div className="admin-filter">
      <button className="admin-filter-button" onClick={() => navigate('/reservations')}>View Reservations</button>
      <button className="admin-filter-button" onClick={() => navigate('/listings')}>View Listings</button>
      <button className="admin-filter-button" onClick={() => navigate('/listings/new')}>Create Listing</button>
    </div>
  )
}

export default AdminFilter
