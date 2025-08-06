
import React, { useState } from "react";
import "./DescriptionSection.css";

export default function DescriptionSection({ listing }) {
  const [expanded, setExpanded] = useState(false);
  if (!listing) return null;
  const desc = listing.description || 'No description provided.';
  const shortDesc = desc.length > 180 ? desc.slice(0, 180) + '...' : desc;

  return (
    <div className="description-section">
      <p className={expanded ? '' : 'ellipsis'}>
        {expanded ? desc : shortDesc}
      </p>
      {desc.length > 180 && (
        <a
          href="#"
          className="see-more"
          onClick={e => { e.preventDefault(); setExpanded(x => !x); }}
        >
          {expanded ? 'See less' : 'See more'}
        </a>
      )}
    </div>
  );
}
