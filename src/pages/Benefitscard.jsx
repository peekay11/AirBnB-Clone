import "./BenefitsCard.css";
import { FaHome, FaDoorOpen, FaRegCalendarCheck } from "react-icons/fa";

export default function BenefitsCard() {
  return (
    <div className="benefits-card">
      <div className="benefit">
        <FaHome className="benefit-icon" />
        <div>
          <strong>Entire home</strong>
          <p>You’ll have the rental unit to yourself.</p>
        </div>
      </div>
      <div className="benefit">
        <FaDoorOpen className="benefit-icon" />
        <div>
          <strong>Self check-in</strong>
          <p>Check yourself in with the lockbox.</p>
        </div>
      </div>
      <div className="benefit">
        <FaRegCalendarCheck className="benefit-icon" />
        <div>
          <strong>Free cancellation</strong>
          <p>Cancel before Feb 14 for a full refund.</p>
        </div>
      </div>
    </div>
  );
  
}
