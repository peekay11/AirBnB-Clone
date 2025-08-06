import React, { useState, useEffect, useRef } from "react";
import { useLocationSync } from "../../context/LocationSyncContext";
import "./Nav.css";
import { FaGlobe, FaBars, FaUserCircle, FaSearch } from "react-icons/fa";
import Logo from "../Logo/Logo";
import { useNavigate, useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { API_URL } from '../../constants';

export default function Nav(props) {
  // State for expanding/collapsing quick search (now hover-based)
  const [isQuickExpanded, setIsQuickExpanded] = useState(false);
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
  const handleLogout = () => {
    localStorage.removeItem('airbnb_user');
    window.location.reload();
  };
  const dropdownOptions = [
    { label: "View Reservations", action: () => navigate("/user-reservations") },
    { label: "Favourites", action: () => navigate("/favourites") },
    { label: "Profile", action: () => navigate("/profile") },
    { label: "Logout", action: handleLogout }
  ];
  const navigateHandler = () => {
    setShowDropdown((prev) => !prev);
  };

  // --- MIDDLE SECTION VARIANTS ---
  // Quick/full search state
  const [locationNames, setLocationNames] = useState([]);
  const { locationValue, setLocationValue } = useLocationSync();
  const [searchLocation, setSearchLocation] = useState(locationValue || "");
  const [searchCheckIn, setSearchCheckIn] = useState(null);
  const [searchCheckOut, setSearchCheckOut] = useState(null);
  const [searchGuests, setSearchGuests] = useState("");
  // Dropdown states for quick-search
  const [showCalendar, setShowCalendar] = useState(false);
  const [showGuests, setShowGuests] = useState(false);
  const calendarRef = useRef(null);
  const guestsRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e) {
      if (calendarRef.current && !calendarRef.current.contains(e.target)) setShowCalendar(false);
      if (guestsRef.current && !guestsRef.current.contains(e.target)) setShowGuests(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    // Only fetch locations if quick/full search is visible
    if (["quick", "full"].includes(variant)) {
      setLocationNames([]);
      fetch(`${API_URL}/listings`)
        .then(res => res.json())
        .then(data => {
          let listingsArr = [];
          if (Array.isArray(data)) {
            listingsArr = data;
          } else if (data && typeof data === 'object') {
            if (Array.isArray(data.data)) listingsArr = data.data;
            else if (Array.isArray(data.listings)) listingsArr = data.listings;
            else if (Array.isArray(data.results)) listingsArr = data.results;
          }
          const names = Array.from(new Set((listingsArr).map(l => l.listingName || l.location).filter(Boolean)));
          setLocationNames(names);
        })
        .catch(() => setLocationNames([]));
    }
  }, [variant]);

  // Sync local state with context
  useEffect(() => {
    setSearchLocation(locationValue || "");
  }, [locationValue]);

  const handleNavSearch = () => {
    const params = [];
    if (searchLocation && searchLocation !== "select" && searchLocation !== "all") params.push(`location=${encodeURIComponent(searchLocation)}`);
    // Use ISO string for date objects, else use as is
    if (searchCheckIn && typeof searchCheckIn === 'object' && searchCheckIn.toISOString) {
      params.push(`checkIn=${encodeURIComponent(searchCheckIn.toISOString().split('T')[0])}`);
    } else if (searchCheckIn) {
      params.push(`checkIn=${encodeURIComponent(searchCheckIn)}`);
    }
    if (searchCheckOut && typeof searchCheckOut === 'object' && searchCheckOut.toISOString) {
      params.push(`checkOut=${encodeURIComponent(searchCheckOut.toISOString().split('T')[0])}`);
    } else if (searchCheckOut) {
      params.push(`checkOut=${encodeURIComponent(searchCheckOut)}`);
    }
    if (searchGuests) params.push(`guests=${encodeURIComponent(searchGuests)}`);
    const query = params.length ? `?${params.join("&")}` : "";
    navigate(`/listing${query}`);
  };

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
          <div className="nav-search full-search" style={{ display: 'flex', alignItems: 'center', gap: 2, background: '#fff', borderRadius: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '0 2px', maxWidth: 410, minWidth: 0, flexWrap: 'nowrap' }}>
            <select className="searchbar-select" value={searchLocation} onChange={e => setSearchLocation(e.target.value)} style={{ borderRadius: 20, height: 30, border: '1px solid #ddd', padding: '0 8px', fontSize: '0.95rem', marginRight: 2, minWidth: 90, maxWidth: 110 }}>
              <option value="select">Select a Location</option>
              <option value="all">All Locations</option>
              {locationNames.length === 0 && <option value="none" disabled>No locations found</option>}
              {locationNames.map((loc, idx) => (
                <option key={idx} value={loc}>{loc}</option>
              ))}
            </select>
            <input type="date" className="searchbar-input" value={searchCheckIn} onChange={e => setSearchCheckIn(e.target.value)} style={{ borderRadius: 20, height: 30, border: '1px solid #ddd', padding: '0 8px', fontSize: '0.95rem', marginRight: 2, minWidth: 80, maxWidth: 95 }} />
            <input type="date" className="searchbar-input" value={searchCheckOut} onChange={e => setSearchCheckOut(e.target.value)} style={{ borderRadius: 20, height: 30, border: '1px solid #ddd', padding: '0 8px', fontSize: '0.95rem', marginRight: 2, minWidth: 80, maxWidth: 95 }} />
            <input type="number" min="1" className="searchbar-input" value={searchGuests} onChange={e => setSearchGuests(e.target.value)} placeholder="Guests" style={{ borderRadius: 20, height: 30, border: '1px solid #ddd', padding: '0 8px', fontSize: '0.95rem', marginRight: 2, minWidth: 55, maxWidth: 65 }} />
            <button className="search-btn" onClick={handleNavSearch} style={{ borderRadius: 20, height: 30, background: '#ff385c', color: '#fff', border: 'none', fontWeight: 'bold', padding: '0 10px', fontSize: '1rem', minWidth: 50 }}>Search</button>
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
          <>
            <div
              className="nav-search quick-search"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: isQuickExpanded ? 'linear-gradient(90deg, #fff 60%, #ffe0f0 100%)' : '#fff',
                borderRadius: isQuickExpanded ? 8 : 32,
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                border: '1px solid #ddd',
                padding: isQuickExpanded ? '6px 10px' : '6px 16px',
                width: 'fit-content',
                minWidth: 0,
                flexWrap: 'nowrap',
                position: 'relative',
                overflow: 'visible',
                maxWidth: '100vw',
                cursor: isQuickExpanded ? 'default' : 'pointer',
                userSelect: 'none',
                animation: isQuickExpanded ? 'bounceIn 0.7s cubic-bezier(.68,-0.55,.27,1.55)' : 'bounceOut 0.7s cubic-bezier(.68,-0.55,.27,1.55)',
                transition: 'background 0.7s cubic-bezier(.68,-0.55,.27,1.55), border-radius 0.7s cubic-bezier(.68,-0.55,.27,1.55), padding 0.7s cubic-bezier(.68,-0.55,.27,1.55)',
              }}
              onMouseEnter={() => setIsQuickExpanded(true)}
              onMouseLeave={() => setIsQuickExpanded(false)}
            >
              {!isQuickExpanded ? (
                <>
                  <span style={{ fontWeight: 500, fontSize: '1.08rem', color: '#222', padding: '0 6px' }}>Quick Search</span>
                  <button
                    className="search-btn"
                    style={{ borderRadius: '50%', height: 36, width: 36, background: '#ff385c', color: '#fff', border: '1px solid #ddd', fontWeight: 'bold', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 0, marginRight: 0, boxShadow: 'none', padding: 0, transition: 'background 0.2s', pointerEvents: 'none' }}
                    tabIndex={-1}
                    aria-label="Expand quick search"
                  >
                    <FaSearch />
                  </button>
                </>
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <select
                      className="searchbar-select"
                      value={searchLocation}
                      onChange={e => {
                        setSearchLocation(e.target.value);
                        setLocationValue(e.target.value);
                      }}
                      style={{ borderRadius: 6, height: 36, border: '1px solid #ddd', padding: '0 12px', fontSize: '1rem', minWidth: 110, maxWidth: 140, background: '#fff', color: '#111' }}
                    >
                      <option value="select">Location</option>
                      <option value="all">All Locations</option>
                      {locationNames.length === 0 && <option value="none" disabled>No locations found</option>}
                      {locationNames.map((loc, idx) => (
                        <option key={idx} value={loc}>{loc}</option>
                      ))}
                    </select>
                    {/* If you have more selects for location, copy the above select and use the same locationNames and value/onChange */}
                    {/* Calendar fields */}
                    <div ref={calendarRef} style={{ display: 'flex', gap: 8, minWidth: 240, maxWidth: 300, position: 'relative' }}>
                      <div
                        className="searchbar-input"
                        style={{ borderRadius: 6, height: 36, border: '1px solid #ddd', padding: '0 14px', fontSize: '1rem', width: 120, background: '#fff', color: '#111', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                        onClick={() => setShowCalendar(true)}
                        key={searchCheckIn ? searchCheckIn.getTime() : 'checkin'}
                      >
                        {searchCheckIn ? searchCheckIn.toLocaleDateString() : 'Check-in'}
                      </div>
                      <div
                        className="searchbar-input"
                        style={{ borderRadius: 6, height: 36, border: '1px solid #ddd', padding: '0 14px', fontSize: '1rem', width: 120, background: '#fff', color: '#111', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                        onClick={() => setShowCalendar(true)}
                        key={searchCheckOut ? searchCheckOut.getTime() : 'checkout'}
                      >
                        {searchCheckOut ? searchCheckOut.toLocaleDateString() : 'Check-out'}
                      </div>
                      {showCalendar && (
                        <div style={{ position: 'absolute', top: 36, left: 0, zIndex: 10, background: '#fff', border: '1px solid #ddd', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.10)', padding: 12, minWidth: 440, animation: 'fadeIn .25s', display: 'flex', gap: 16 }}>
                          <div>
                            <div style={{ fontWeight: 600, marginBottom: 4 }}>Check-in</div>
                            <DatePicker
                              selected={searchCheckIn}
                              onChange={date => {
                                setSearchCheckIn(date);
                                setShowCalendar(false);
                                setTimeout(() => handleNavSearch(), 0);
                              }}
                              inline
                            />
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, marginBottom: 4 }}>Check-out</div>
                            <DatePicker
                              selected={searchCheckOut}
                              onChange={date => {
                                setSearchCheckOut(date);
                                setShowCalendar(false);
                                setTimeout(() => handleNavSearch(), 0);
                              }}
                              inline
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    {/* Guests dropdown */}
                    <div ref={guestsRef} style={{ position: 'relative', minWidth: 70, maxWidth: 90 }}>
                      <input
                        type="text"
                        className="searchbar-input"
                        value={searchGuests}
                        onFocus={() => setShowGuests(true)}
                        onClick={() => setShowGuests(true)}
                        readOnly
                        placeholder="Guests"
                        style={{ borderRadius: 6, height: 36, border: '1px solid #ddd', padding: '0 14px', fontSize: '1rem', width: '100%', background: '#fff', color: '#111' }}
                      />
                      {showGuests && (
                        <div style={{ position: 'absolute', top: 36, left: 0, zIndex: 10, background: '#fff', border: '1px solid #ddd', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.10)', padding: 12, minWidth: 120, animation: 'fadeIn .25s', display: 'flex', alignItems: 'center', gap: 8 }}>
                          <button
                            style={{ fontSize: '1.2rem', borderRadius: 6, border: '1px solid #ddd', background: '#f7f7f7', width: 32, height: 32, fontWeight: 'bold', color: '#ff385c', cursor: 'pointer' }}
                            onClick={() => {
                              const val = parseInt(searchGuests) || 1;
                              if (val > 1) {
                                setSearchGuests(String(val - 1));
                                setTimeout(() => handleNavSearch(), 0);
                              }
                            }}
                            aria-label="Decrease guests"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min={1}
                            value={searchGuests}
                            onChange={e => {
                              let val = parseInt(e.target.value);
                              if (isNaN(val) || val < 1) val = 1;
                              setSearchGuests(String(val));
                              setTimeout(() => handleNavSearch(), 0);
                            }}
                            style={{ width: 48, fontSize: '1rem', borderRadius: 6, border: '1px solid #ddd', padding: 6, textAlign: 'center' }}
                          />
                          <button
                            style={{ fontSize: '1.2rem', borderRadius: 6, border: '1px solid #ddd', background: '#f7f7f7', width: 32, height: 32, fontWeight: 'bold', color: '#ff385c', cursor: 'pointer' }}
                            onClick={() => {
                              const val = parseInt(searchGuests) || 1;
                              setSearchGuests(String(val + 1));
                              setTimeout(() => handleNavSearch(), 0);
                            }}
                            aria-label="Increase guests"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                    {/* Search button always inside the bar */}
                    <button
                      className="search-btn"
                      onClick={handleNavSearch}
                      style={{ borderRadius: '50%', height: 40, width: 40, background: '#ff385c', color: '#fff', border: '1px solid #ddd', fontWeight: 'bold', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 0, marginRight: 0, boxShadow: 'none', padding: 0, transition: 'background 0.2s' }}
                    >
                      <FaSearch />
                    </button>
                  </div>
                  {/* Fade-in, bounce, and color animation keyframes */}
                  <style>{`
                    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px);} to { opacity: 1; transform: none;} }
                    @keyframes bounceIn {
                      0% { transform: scale(0.95) translateY(10px); box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
                      60% { transform: scale(1.05) translateY(-6px); box-shadow: 0 8px 24px rgba(255,56,92,0.10); }
                      80% { transform: scale(0.98) translateY(2px); }
                      100% { transform: scale(1) translateY(0); }
                    }
                    @keyframes bounceOut {
                      0% { transform: scale(1) translateY(0); }
                      100% { transform: scale(0.95) translateY(10px); }
                    }
                  `}</style>
                </>
              )}
            </div>
          </>
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
          <a
            href="#"
            className={`nav-host${isLogin ? ' nav-link-hidden' : ''}`}
            onClick={e => {
              e.preventDefault();
              // Check for user authentication robustly
              const user = localStorage.getItem('airbnb_user');
              let isAuthenticated = false;
              if (user) {
                try {
                  const parsed = JSON.parse(user);
                  isAuthenticated = !!parsed && !!parsed.username;
                } catch {
                  isAuthenticated = false;
                }
              }
              if (isAuthenticated) {
                navigate('/admin');
              } else {
                navigate('/login?host=true');
              }
            }}
          >
            Become a host
          </a>
          <FaGlobe size={18} />
          <div className="nav-profile-menu" style={{ position: "relative" }}>
            <FaBars size={16} />
            <FaUserCircle size={20} onClick={navigateHandler} />
            {userName && <span className="nav-username">{userName}</span>}
            {showDropdown && (
              <div className="nav-profile-dropdown">
                {dropdownOptions.map((opt) => (
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
        <div className="nav-bottom-section" style={{ display: 'flex', alignItems: 'center', gap: 8, minHeight: 48 }}>
          {React.Children.map(bottomSection, child => {
            // Style for pills and select for consistent alignment
            const baseStyle = {
              height: 36,
              minWidth: 80,
              borderRadius: 20,
              fontWeight: 500,
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: 0
            };
            // Style All Locations pill
            if (React.isValidElement(child) && child.props && child.props.children && typeof child.props.children === 'string' && child.props.children.toLowerCase().includes('all location')) {
              return React.cloneElement(child, {
                style: {
                  ...baseStyle,
                  ...(child.props.style || {}),
                  padding: '0 18px',
                  background: '#fff',
                  border: '1px solid #ddd',
                  color: '#222',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                }
              });
            }
            // Style select dropdown
            if (React.isValidElement(child) && child.type === 'select') {
              return React.cloneElement(child, {
                style: {
                  ...baseStyle,
                  ...(child.props.style || {}),
                  padding: '0 12px',
                  background: '#fff',
                  border: '1px solid #ddd',
                  color: '#222',
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  outline: 'none',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  marginTop: 5
                }
              });
            }
            return child;
          })}
        </div>
      )}
    </>
  );
}
