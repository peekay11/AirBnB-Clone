import { API_URL } from '../constants';
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
    const fetchListing = async () => {
      setError(null);
      try {
        const res = await fetch(`${API_URL}/listings/${id}`);
        const result = await res.json();
        let listingObj = null;
        if (result && typeof result === 'object' && 'success' in result) {
          if (!result.success) throw new Error(result.error || "Listing not found");
          listingObj = result.data;
        } else {
          listingObj = result;
        }
        setListing(listingObj);
      } catch (err) {
        setError(err.message || "Listing not found");
      }
    };
    fetchListing();
  }, [id]);

  if (error) return <div>{error}</div>;
  if (!listing) return <div>Loading...</div>;

  // Always fill the gallery with 5 images (1 main + 4 side), duplicating as needed
  let galleryImages = listing.images || [listing.image];
  if (Array.isArray(galleryImages) && galleryImages.length < 5) {
    const toFill = 5 - galleryImages.length;
    galleryImages = [...galleryImages];
    for (let i = 0; i < toFill; i++) {
      galleryImages.push(galleryImages[i % galleryImages.length]);
    }
  }
  return (
    <div className="single-location">
      <HeaderBar listing={listing} />
      <Gallery images={galleryImages} />
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
