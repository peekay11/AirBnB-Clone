import "./Inspire.css";

const locations = [
  {
    title: "Sandton City Hotel",
    image: "https://th.bing.com/th/id/OIP.KzB9mDDBi2hS0Nv4XuS0TgHaE8?rs=1&pid=ImgDetMain",
    distance: "53 Km away",
  },
  {
    title: "Joburg City Hotel",
    image: "https://th.bing.com/th/id/OIP.KzB9mDDBi2hS0Nv4XuS0TgHaE8?rs=1&pid=ImgDetMain",
    distance: "168 Km away",
  },
  {
    title: "Woodmead Hotel",
    image: "https://th.bing.com/th/id/OIP.KzB9mDDBi2hS0Nv4XuS0TgHaE8?rs=1&pid=ImgDetMain",
    distance: "30 miles away",
  },
  {
    title: "Hyde Park Hotel",
    image: "https://th.bing.com/th/id/OIP.KzB9mDDBi2hS0Nv4XuS0TgHaE8?rs=1&pid=ImgDetMain",
    distance: "33 Km away",
  },
];

function Inspire() {
  return (
    <section className="inspire-section-wrapper">
      <div className="container">
        <h2 className="inspire-heading">Inspire your next trip</h2>
        <div className="inspire-card-grid">
          {locations.map((loc, i) => (
            <div className="inspire-card" key={i}>
              <img src={loc.image} alt={loc.title} className="inspire-img" />
              <div className="inspire-caption inspire-caption-white">
                <h3>{loc.title}</h3>
                <p>{loc.distance}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Inspire;
