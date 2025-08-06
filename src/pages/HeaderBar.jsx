import { FaStar, FaHeart } from "react-icons/fa";
import { useState, useEffect } from "react";
// import { useLocation } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
import { FiShare2 } from "react-icons/fi";
import "./HeaderBar.css";


export default function HeaderBar({ listing }) {
  const [saved, setSaved] = useState(false);
  // const location = useLocation();

  useEffect(() => {
    if (!listing) return;
    // Check if this listing is in favourites (localStorage)
    const favs = JSON.parse(localStorage.getItem('favourites') || '[]');
    setSaved(favs.some(f => f._id === listing._id));
  }, [listing]);
  const handleShare = async () => {
    const url = window.location.origin + `/listing/${listing._id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: listing.listingName,
          text: `Check out this listing on Airbon!`,
          url,
        });
      } catch (e) {
        // User cancelled or error
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        // Optionally, you can show a toast or nothing at all
      } catch {
        // Optionally, you can show a toast or nothing at all
      }
    }
  };

  const handleSave = () => {
    if (!listing) return;
    let favs = JSON.parse(localStorage.getItem('favourites') || '[]');
    if (saved) {
      favs = favs.filter(f => f._id !== listing._id);
    } else {
      favs.push(listing);
    }
    localStorage.setItem('favourites', JSON.stringify(favs));
    setSaved(!saved);
  };

  if (!listing) return null;
  return (
    <div className="header-bar">
      <div className="header-left">
        <h1>{listing.listingName}</h1>
        <div className="listing-meta">
          <FaStar className="icon" /> {listing.rating || "-"} · {listing.reviews || "-"} reviews
          {listing.superhost ? " · Superhost" : ""}
          · <MdLocationOn className="icon" /> {listing.location || "-"}
        </div>
      </div>
      <div className="header-right">
        <button onClick={handleShare}><FiShare2 /> Share</button>
        <button onClick={handleSave} style={{ color: saved ? '#ff385c' : undefined, fontWeight: saved ? 600 : undefined }}>
          <FaHeart style={{ color: saved ? '#ff385c' : undefined, verticalAlign: 'middle' }} /> {saved ? 'Saved' : 'Save'}
        </button>
        {/* No shareMsg shown, silent fallback */}
      </div>
    </div>
  );
}
