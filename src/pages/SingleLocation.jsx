import React, { useState, useEffect } from "react";
import "./SingleLocation.css";
import HeaderBar from "./HeaderBar";
import { useParams } from "react-router-dom";
import Gallery from "./Gallery";
import RentalInfo from "./RentalInfo";
import BenefitsCard from "./Benefitscard";
import DescriptionSection from "./DescriptionSection";
import BookingCard from "./BookingCard";


export default function SingleLocation() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/listings/${id}`)
      .then(res => res.json())
      .then(result => {
        if (!result.success) throw new Error(result.error || "Listing not found");
        setListing(result.data);
      })
      .catch(err => setError(err.message || "Listing not found"));
  }, [id]);

  if (error) return <div>{error}</div>;
  if (!listing) return <div>Loading...</div>;

  return (
    <div className="single-location">
      <HeaderBar listing={listing} />
      <Gallery images={listing.images || [listing.image]} />
      <div className="location-main">
        <div className="location-left">
          <RentalInfo listing={listing} />
          <BenefitsCard listing={listing} />
          <DescriptionSection listing={listing} />
        </div>
        <div className="location-right">
          <BookingCard listing={listing} />
        </div>
      </div>
      <p className="report-link">Report this listing</p>
    </div>
  );
}
