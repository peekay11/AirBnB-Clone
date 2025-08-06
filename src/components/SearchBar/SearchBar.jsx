
import "./SearchBar.css";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_URL } from '../../constants';

export default function SearchBar() {
  const navigate = useNavigate();
  const [locationNames, setLocationNames] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("select");
  const [loadingLocations, setLoadingLocations] = useState(true);

  useEffect(() => {
    setLoadingLocations(true);
    fetch(`${API_URL}/listings`)
      .then(res => res.json())
      .then(data => {
        let listingsArr = [];
        if (Array.isArray(data)) listingsArr = data;
        else if (data && Array.isArray(data.data)) listingsArr = data.data;
        else if (data && Array.isArray(data.listings)) listingsArr = data.listings;
        // Try to get both listingName and location fields
        const names = Array.from(new Set((listingsArr)
          .map(l => l.listingName || l.location)
          .filter(Boolean)
        ));
        setLocationNames(names);
        setLoadingLocations(false);
      })
      .catch(() => {
        setLocationNames([]);
        setLoadingLocations(false);
      });
  }, []);

  const handleLocationChange = (e) => {
    const value = e.target.value;
    setSelectedLocation(value);
    if (value && value !== "select") {
      // Always go to /listing and pass location as query param
      if (value === "all") {
        navigate("/listing");
      } else {
        navigate(`/listing?location=${encodeURIComponent(value)}`);
      }
    }
  };

  return (
    <div className="searchbar">
      <div className="searchbar-group">
        <label className="searchbar-label">Hotels</label>
        <select className="searchbar-select" value={selectedLocation} onChange={handleLocationChange} disabled={loadingLocations}>
          <option value="select">{loadingLocations ? "Loading locations..." : "Select a Location"}</option>
          <option value="all">All Locations</option>
          {(!loadingLocations && locationNames.length === 0) && (
            <option value="none" disabled>No locations found</option>
          )}
          {locationNames.map((loc, idx) => (
            <option key={idx} value={loc}>{loc}</option>
          ))}
        </select>
      </div>

      <div className="searchbar-divider" />
      <div className="searchbar-group">
        <label className="searchbar-label">
          Check in<br /><span className="searchbar-sub">Add dates</span>
        </label>
      </div>
      <div className="searchbar-divider" />
      <div className="searchbar-group">
        <label className="searchbar-label">
          Check out<br /><span className="searchbar-sub">Add dates</span>
        </label>
      </div>
      <div className="searchbar-divider" />
      <div className="searchbar-group">
        <label className="searchbar-label">
          Guests<br /><span className="searchbar-sub">Add guests</span>
        </label>
      </div>
      <button className="searchbar-btn"><FaSearch /></button>
    </div>
  );
}
