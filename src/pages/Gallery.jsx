import "./Gallery.css";

export default function Gallery({ images }) {
  if (!images || images.length === 0) return null;
  return (
    <div className="gallery">
      <div className="gallery-left">
        <img src={images[0]} alt="Main" />
      </div>
      <div className="gallery-right">
        {(Array.isArray(images) ? images.slice(1, 5) : []).map((img, i) => (
          <img key={i} src={img} alt={i + 1} />
        ))}
      </div>
    </div>
  );
}

