import "./FooterLinks.css";

export default function FooterLinks() {
  const sections = {
    "Support": ["Help Centre", "Safety", "Cancellation options"],
    "Community": ["Airbnb.org", "Combating discrimination"],
    "Hosting": ["Airbnb your home", "Responsible hosting"],
    "About": ["Careers", "News", "Investors"],
  };

  return (
    <footer className="footer-links">
      {Object.entries(sections).map(([heading, links]) => (
        <div key={heading} className="footer-section">
          <h4>{heading}</h4>
          {links.map((link) => (
            <p key={link}>{link}</p>
          ))}
        </div>
      ))}
    </footer>
  );
}
