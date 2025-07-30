import "./Discover.css";

export default function Discover() {
  return (
    <section className="discover-section">
      <div className="container">
        <h2 className="discover-title">Discover Airbnb Experiences</h2>
        <div className="discover-list">
          <div
            className="discover-card"
            style={{
              backgroundImage:
                "url('https://www.shutterstock.com/image-photo/stunning-sunset-view-ayia-napa-600nw-2460216261.jpg')",
            }}
          >
            <div className="discover-overlay">
              <h3>Things to do on <br/> your trip</h3>
              <button>Experiences</button>
            </div>
          </div>
          <div
            className="discover-card"
            style={{
              backgroundImage:
                "url('https://curlytales.com/wp-content/uploads/2023/10/men-cooking.jpg')",
            }}
          >
            <div className="discover-overlay">
              <h3>Things to do <br/>from home</h3>
              <button>Online Experiences</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
