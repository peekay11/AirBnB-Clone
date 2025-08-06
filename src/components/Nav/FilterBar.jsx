import { FaFilter } from "react-icons/fa";
import "./FilterBar.css";

export default function FilterBar({ locations, selectedLocation, onLocationChange, selectedAmenity, onAmenityChange, selectedPrice, onPriceChange }) {
  const priceOptions = [
    { label: "Any Price", value: "" },
    { label: "Up to R200", value: "200" },
    { label: "Up to R300", value: "300" },
    { label: "Up to R400", value: "400" },
  ];
  const amenityOptions = [
    "WiFi", "Kitchen", "Free Parking", "Heating", "Washer", "Coffee maker", "Air conditioning", "Private patio", "Pool", "Breakfast"
  ];

  return (
    <div className="filter-bar">
      {/* Location dropdown */}
      <select value={selectedLocation} onChange={e => onLocationChange(e.target.value)} style={{ marginRight: '12px', padding: '6px', borderRadius: 20 }}>
        <option value="">All Locations</option>
        {locations && locations.map((loc, idx) => (
          <option key={idx} value={loc}>{loc}</option>
        ))}
      </select>

      {/* Price pills */}
      {priceOptions.map(opt => (
        <button
          key={opt.value}
          className={selectedPrice === opt.value ? "active" : ""}
          style={{
            borderRadius: 20,
            marginRight: 4,
            padding: '0.25rem 1.6rem',
            border: '1px solid #ddd',
            background: selectedPrice === opt.value ? '#ff385c' : '#fff',
            color: selectedPrice === opt.value ? '#fff' : '#222',
            fontWeight: selectedPrice === opt.value ? 'bold' : 'normal',
            fontSize: '0.95rem',
            height: '32px',
            whiteSpace: 'nowrap',
          }}
          onClick={() => onPriceChange(selectedPrice === opt.value ? "" : opt.value)}
        >{opt.label}</button>
      ))}

      {/* Amenity pills */}
      <button
        className={selectedAmenity === "" ? "active" : ""}
        style={{
          borderRadius: 20,
          marginRight: 4,
          padding: '0.25rem 1.6rem',
          border: '1px solid #ddd',
          background: selectedAmenity === "" ? '#ff385c' : '#fff',
          color: selectedAmenity === "" ? '#fff' : '#222',
          fontWeight: selectedAmenity === "" ? 'bold' : 'normal',
          fontSize: '0.95rem',
          height: '32px',
          whiteSpace: 'nowrap',
        }}
        onClick={() => onAmenityChange(selectedAmenity === "" ? "" : "")}
      >Any Amenity</button>
      {amenityOptions.map(opt => (
        <button
          key={opt}
          className={selectedAmenity === opt ? "active" : ""}
          style={{
            borderRadius: 20,
            marginRight: 4,
            padding: '0.25rem 1.6rem',
            border: '1px solid #ddd',
            background: selectedAmenity === opt ? '#ff385c' : '#fff',
            color: selectedAmenity === opt ? '#fff' : '#222',
            fontWeight: selectedAmenity === opt ? 'bold' : 'normal',
            fontSize: '0.95rem',
            height: '32px',
            whiteSpace: 'nowrap',
          }}
          onClick={() => onAmenityChange(selectedAmenity === opt ? "" : opt)}
        >{opt}</button>
      ))}

      <button style={{ borderRadius: 20, marginRight: 4, padding: '0.25rem 0.9rem', border: '1px solid #ddd', background: '#fff', color: '#222', fontSize: '0.95rem', height: '32px' }}><FaFilter /> Filters</button>
    </div>
  );
}