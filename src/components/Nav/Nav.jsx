import React from "react";
import "./Nav.css";
import { FaGlobe, FaBars, FaUserCircle, FaSearch } from "react-icons/fa";
import Logo from "../Logo/Logo";
import { useNavigate, useLocation } from "react-router-dom";

export default function Nav(props) {
  const navigate = useNavigate();
  const location = useLocation();
  // Show logged-in user name/email on all pages
  let userName = null;
  if (props.user && props.user.username) {
    userName = props.user.username;
  } else {
    const user = localStorage.getItem('airbnb_user');
    if (user) {
      try {
        userName = JSON.parse(user).username;
      } catch {
        userName = null;
      }
    }
  }
  // Accept variant prop: "classic", "simple", "full", "compact", "quick"
  const { variant = "classic", isLogin, bottomSection } = props;

  const [showDropdown, setShowDropdown] = React.useState(false);
  const dropdownOptions = [
    { label: "View Reservations", action: () => navigate("/user-reservations") },
    { label: "Favourites", action: () => navigate("/favourites") },
    { label: "Profile", action: () => navigate("/profile") },
    { label: "Logout", action: () => navigate("/login") }
  ];
  const navigateHandler = () => {
    setShowDropdown((prev) => !prev);
  };

  // --- MIDDLE SECTION VARIANTS ---
  const renderMiddleSection = () => {
    switch (variant) {
      case "classic":
        return (
          <nav className="nav-items">
            <a href="#" className={isLogin ? "nav-link-hidden" : ""}>Places to stay</a>
            <a href="#" className={isLogin ? "nav-link-hidden" : ""}>Experiences</a>
            <a href="#" className={isLogin ? "nav-link-hidden" : ""}>Online experiences</a>
          </nav>
        );
      case "simple":
        return (
          <div className="nav-search simple-search">
            <input type="text" placeholder="Start your search" />
            <button className="search-btn"><FaSearch /></button>
          </div>
        );
      case "full":
        return (
          <div className="nav-search full-search">
            <div className="search-section">
              <div>
                <div className="search-label">Location</div>
                <div className="search-value">Where are you going?</div>
              </div>
              <div>
                <div className="search-label">Check in</div>
                <div className="search-value">Add dates</div>
              </div>
              <div>
                <div className="search-label">Check out</div>
                <div className="search-value">Add dates</div>
              </div>
              <div>
                <div className="search-label">Guests</div>
                <div className="search-value">Add guests</div>
              </div>
            </div>
            <button className="search-btn"><FaSearch /></button>
          </div>
        );
      case "compact":
        return (
          <div className="nav-search compact-search">
            <div className="search-section">
              <span className="search-bold">Bordeaux</span>
              <span>Add dates</span>
              <span>Add guests</span>
            </div>
            <button className="search-btn"><FaSearch /></button>
          </div>
        );
      case "quick":
        return (
          <div className="nav-search quick-search">
            <span className="search-bold">Bordeaux</span>
            <span>Feb 19–26</span>
            <span>2 guests</span>
            <button className="search-btn"><FaSearch /></button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <header className={`nav-header${location.pathname === '/' ? ' home' : ''}`}>
        <div className="nav-logo">
          <Logo width={100} />
        </div>
        {renderMiddleSection()}
        <div className="nav-right">
          <a href="#" className={`nav-host${isLogin ? ' nav-link-hidden' : ''}`} onClick={() => {
            if (userName) {
              navigate('/admin');
            } else {
              navigate('/login?host=true');
            }
          }}>Become a host</a>
          <FaGlobe size={18} />
          <div className="nav-profile-menu" style={{ position: "relative" }}>
            <FaBars size={16} />
            <FaUserCircle size={20} onClick={navigateHandler} />
            {userName && <span className="nav-username">{userName}</span>}
            {showDropdown && (
              <div className="nav-profile-dropdown">
                {dropdownOptions.map((opt, idx) => (
                  <button
                    key={opt.label}
                    className="nav-profile-dropdown-option"
                    onClick={() => {
                      setShowDropdown(false);
                      opt.action();
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>
      {bottomSection && (
        <div className="nav-bottom-section">
          {bottomSection}
        </div>
      )}
    </>
  );
}
