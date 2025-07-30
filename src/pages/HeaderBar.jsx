import { FaStar, FaHeart } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { FiShare2 } from "react-icons/fi";
import "./HeaderBar.css";

export default function HeaderBar({ listing }) {
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
        <button><FiShare2 /> Share</button>
        <button><FaHeart /> Save</button>
      </div>
    </div>
  );
}
