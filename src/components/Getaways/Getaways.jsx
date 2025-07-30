import "./Getaways.css";

export default function GetawayGrid() {
  return (
    <section className="getaway-grid-section">
      <div className="container">
        <h2 className="getaway-grid-title">Inspiration for future getaways</h2>

        <div className="getaway-categories">
          <span className="getaway-category">Destinations for arts & culture</span>
          <span className="getaway-category">Destinations for outdoor adventure</span>
          <span className="getaway-category">Beach destinations</span>
          <span className="getaway-category">Popular destinations</span>
          <span className="getaway-category">Unique Stays</span>
        </div>

        <div className="getaway-grid-list">
          <div className="getaway-grid-item">
            <p>Phoenix</p>
            <span>Arizona</span>
          </div>
          <div className="getaway-grid-item">
            <p>San Francisco</p>
            <span>California</span>
          </div>
          <div className="getaway-grid-item">
            <p>Keswick</p>
            <span>England</span>
          </div>
          <div className="getaway-grid-item">
            <p>Hot Springs</p>
            <span>Arkansas</span>
          </div>
          <div className="getaway-grid-item">
            <p>Barcelona</p>
            <span>Catalonia</span>
          </div>
          <div className="getaway-grid-item">
            <p>London</p>
            <span>England</span>
          </div>
          <div className="getaway-grid-item">
            <p>Los Angeles</p>
            <span>California</span>
          </div>
          <div className="getaway-grid-item">
            <p>Prague</p>
            <span>Czechia</span>
          </div>
          <div className="getaway-grid-item">
            <p>Scarborough</p>
            <span>England</span>
          </div>
          <div className="getaway-grid-item">
            <p>San Diego</p>
            <span>California</span>
          </div>
          <div className="getaway-grid-item">
            <p>Washington</p>
            <span>D.C.</span>
          </div>
          <div className="getaway-grid-item show-more">
            <a href="#">Show more</a>
          </div>
        </div>
      </div>
    </section>
  );
}
