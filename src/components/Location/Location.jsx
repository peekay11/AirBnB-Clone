import "./Location.css";

export default function Location({ title, image, distance }) {
  return (
    <div className="location-card">
      <img src={image} alt={title} className="location-img" />
      <h4>{title}</h4>
      <p>{distance}</p>
    </div>
  );
}
