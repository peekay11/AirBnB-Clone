import "./Footer.css";

export default function Footer(props) {
  return (
    <div className="footer">
      <p>&copy; {new Date().getFullYear()} Airbnb, Inc.</p>
      <div className="footer-right">
        <span className="footer-lang">🌐 English</span>
        <span className="footer-currency">ZAR</span>
        <span className="footer-social">🔗 Social Icons</span>
      </div>
    </div>
  );
}
