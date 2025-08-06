import "./BenefitsCard.css";
import { FaHome, FaDoorOpen, FaRegCalendarCheck } from "react-icons/fa";

export default function BenefitsCard({ listing }) {
  return (
    <div className="benefits-card">
      <div className="benefit">
        <FaHome className="benefit-icon" />
        <div>
          <strong>Entire {listing?.type || 'home'}</strong>
          <p>You’ll have the {listing?.type || 'rental unit'} to yourself.</p>
        </div>
      </div>
      <div className="benefit">
        <FaDoorOpen className="benefit-icon" />
        <div>
          <strong>{listing?.selfCheckInTitle || 'Self check-in'}</strong>
          <p>{listing?.selfCheckIn || 'Check yourself in with the lockbox.'}</p>
        </div>
      </div>
      <div className="benefit">
        <FaRegCalendarCheck className="benefit-icon" />
        <div>
          <strong>{listing?.cancellationTitle || 'Free cancellation'}</strong>
          <p>{listing?.cancellationPolicy || 'Cancel within 48 hours for a full refund.'}</p>
        </div>
      </div>
    </div>
  );
}
