import "./DescriptionSection.css";

export default function DescriptionSection({ listing }) {
  if (!listing) return null;
  return (
    <div className="description-section">
      <p>
        {listing.description || 'No description provided.'}
      </p>
      <a href="#" className="see-more">See more</a>
    </div>
  );
}
