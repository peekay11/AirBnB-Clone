import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logoWhite from "../../assets/Logo-White.svg";
import logoPink from "../../assets/Logo-Pink.svg";
import "./Logo.css";

const Logo = ({ width = 120 }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === "/";
  const logoSrc = isHome ? logoWhite : logoPink;

  const toHome = () => {
    navigate("/");
  };

  return (
    <img
      src={logoSrc}
      alt="Airbnb Logo"
      className="logo-img"
      style={{ width: `${width}px` }}
      onClick={toHome}
    />
  );
};

export default Logo;
