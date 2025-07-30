import React, { useState, useEffect } from "react";
import "./SingleLocation.css";
import HeaderBar from "./HeaderBar";
import { useParams } from "react-router-dom";
import Gallery from "./Gallery";
import RentalInfo from "./RentalInfo";
import BenefitsCard from "./BenefitsCard";
import DescriptionSection from "./DescriptionSection";
import BookingCard from "./BookingCard";


export default function SingleLocation() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:4000/listings/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Listing not found");
        return res.json();
      })
      .then(data => setListing(data))
      .catch(() => setError("Listing not found"));
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
