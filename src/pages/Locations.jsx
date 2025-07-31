import "./Locations.css";

function Locations() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedLocation, setSelectedLocation] = React.useState("");
  const [selectedAmenity, setSelectedAmenity] = React.useState("");
  const [selectedPrice, setSelectedPrice] = React.useState("");
  const [locations, setLocations] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/listings`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch listings");
        return res.json();
      })
      .then(data => {
        setLocations(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Unable to fetch listings. Please check your backend connection.");
        setLoading(false);
      });
  }, []);

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const loc = params.get("location") || "";
    setSelectedLocation(loc);
  }, [location.search]);

  const locationNames = Array.from(new Set(locations.map(l => l.listingName)));

  let filteredLocations = locations;
  if (selectedLocation) {
    filteredLocations = filteredLocations.filter(loc => loc.listingName === selectedLocation);
  }
  if (selectedAmenity) {
    filteredLocations = filteredLocations.filter(loc => loc.amenities && loc.amenities.includes(selectedAmenity));
  }
  if (selectedPrice) {
    filteredLocations = filteredLocations.filter(loc => {
      const price = typeof loc.price === "string" ? parseInt(loc.price.replace(/[^0-9]/g, "")) : loc.price;
      return price <= parseInt(selectedPrice);
    });
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <>
      <Nav
        variant="quick"
        bottomSection={
          <FilterBar
            locations={locationNames}
            selectedLocation={selectedLocation}
            onLocationChange={setSelectedLocation}
            selectedAmenity={selectedAmenity}
            onAmenityChange={setSelectedAmenity}
            selectedPrice={selectedPrice}
            onPriceChange={setSelectedPrice}
          />
        }
      />

      <div className="location-container">
        <p className="locations-heading">{filteredLocations.length}+ stays found</p>

        {filteredLocations.map((location) => (
          <div
            key={location._id}
            className="location-card"
            onClick={() => navigate(`/listing/${location._id}`)}
          >
            <img src={location.images && location.images[0] ? (location.images[0].startsWith('http') ? location.images[0] : `/assets/images/${location.images[0]}`) : ''} alt={location.listingName} className="location-image" />

            <div className="location-info">
              <div className="location-header">
                <h2 className="location-name">{location.listingName}</h2>
                <FaHeart className="heart-icon" />
              </div>

              <div className="location-rating">
                <FaStar className="star-icon" />
                <span>{location.rating}</span>
                <span className="review-count">· {location.reviews} reviews</span>
              </div>

              <p className="location-details">
                {location.guests} · {location.beds} beds · {location.baths} baths
              </p>

              <p className="location-amenities">
                {location.amenities && location.amenities.join(" · ")}
              </p>

              <p className="location-price">
                {typeof location.price === "string" ? location.price : `R${location.price}`} <span className="price-subtext">/ night</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Locations;
import { FaHeart, FaStar } from "react-icons/fa";
import "./Locations.css";
import Nav from "../components/Nav/Nav";
import FilterBar from "../components/Nav/FilterBar";
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";



