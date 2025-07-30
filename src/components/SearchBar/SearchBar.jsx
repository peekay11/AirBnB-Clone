import "./SearchBar.css";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
// Sync location names with Locations.jsx
const locationNames = [
  "Bordeaux Getaway",
  "Paris Retreat",
  "Lyon Escape",
  "Marseille Hideaway",
  "Nice Sanctuary"
];

export default function SearchBar() {
  const navigate = useNavigate();

  const handleLocationChange = (e) => {
    const value = e.target.value;
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
        <select className="searchbar-select" onChange={handleLocationChange}>
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
