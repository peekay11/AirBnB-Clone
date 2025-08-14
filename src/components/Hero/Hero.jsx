import bg from "../../assets/images/home.jpg";
import "./Hero.css";

export default function Hero({
  image = bg,
  title = "Not sure where to go? Perfect.",
  buttonText = "I'm Flexible",
  subtitle = "",
}) {
  return (
    <section
      className="hero-section"
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className="hero-overlay">
  <h1 className="hero-title hero-title-white">{title}</h1>
        {subtitle && <p className="hero-subtitle">{subtitle}</p>}
        <button className="hero-btn">{buttonText}</button>
      </div>
    </section>
  );
}
