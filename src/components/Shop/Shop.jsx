import "./Shop.css";

export default function Shop() {
  return (
    <section className="shop-section">
      <div className="container" style={{ display: "flex", alignItems: "stretch", gap: "32px" }}>
        <div className="shop-content">
          <h2 className="section-heading">Shop Airbnb gift cards</h2>
          <button className="shop-btn">Learn more</button>
        </div>
        <img src="/src/assets/images/Gift Cards.png" className="shop-img" alt="Airbnb Gift Cards" />
      </div>
    </section>
  );
}
