
import "./SearchBar.css";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLocationSync } from "../../context/LocationSyncContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./CalendarTheme.css";
import { API_URL } from '../../constants';


export default function SearchBar() {
  const navigate = useNavigate();
  const [locationNames, setLocationNames] = useState([]);
  const { locationValue, setLocationValue } = useLocationSync();
  const [selectedLocation, setSelectedLocation] = useState(locationValue || "select");
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState(1);

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


  // Sync local state with context
  useEffect(() => {
    setSelectedLocation(locationValue || "select");
  }, [locationValue]);

  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value);
    setLocationValue(e.target.value);
  };

  const handleSearch = () => {
    const params = [];
    if (selectedLocation && selectedLocation !== "select" && selectedLocation !== "all") {
      params.push(`location=${encodeURIComponent(selectedLocation)}`);
    }
    if (checkIn) {
      params.push(`checkIn=${encodeURIComponent(checkIn.toISOString().split('T')[0])}`);
    }
    if (checkOut) {
      params.push(`checkOut=${encodeURIComponent(checkOut.toISOString().split('T')[0])}`);
    }
    if (guests) {
      params.push(`guests=${guests}`);
    }
    const query = params.length ? `?${params.join('&')}` : '';
    navigate(`/listing${query}`);
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
          Check in<br />
          <DatePicker
            selected={checkIn}
            onChange={date => setCheckIn(date)}
            selectsStart
            startDate={checkIn}
            endDate={checkOut}
            placeholderText="Add date"
            className="searchbar-date"
          />
        </label>
      </div>
      <div className="searchbar-divider" />
      <div className="searchbar-group">
        <label className="searchbar-label">
          Check out<br />
          <DatePicker
            selected={checkOut}
            onChange={date => setCheckOut(date)}
            selectsEnd
            startDate={checkIn}
            endDate={checkOut}
            minDate={checkIn}
            placeholderText="Add date"
            className="searchbar-date"
          />
        </label>
      </div>
      <div className="searchbar-divider" />
      <div className="searchbar-group">
        <label className="searchbar-label">
          Guests<br />
          <input
            type="number"
            min={1}
            max={20}
            value={guests}
            onChange={e => setGuests(Number(e.target.value))}
            className="searchbar-guests"
            style={{ width: 60, borderRadius: 8, border: '1px solid #eee', padding: '2px 8px', fontSize: '1rem', marginTop: 2 }}
            placeholder="Add guests"
          />
        </label>
      </div>
      <button className="searchbar-btn" onClick={handleSearch}><FaSearch /></button>
    </div>
  );
}
