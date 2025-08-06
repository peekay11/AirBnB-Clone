import "./RentalInfo.css";

export default function RentalInfo({ listing }) {
  if (!listing) return null;
  return (
    <div className="rental-info">
      <h3>Rental unit hosted by {listing.username || listing.host || 'Host'}</h3>
      <div className="rental-meta">
        <p>
          {listing.guests || 2} guests · {listing.rooms || 1} bedroom · {listing.beds || 1} bed · {listing.baths || 1} bath
        </p>
        <img src={listing.hostImage || "https://a0.muscache.com/im/pictures/user/42c6bf50-bd66-44d8-8093-da278e65b0b3.jpg?im_w=240"} alt="host" className="host-img" />
      </div>
    </div>
  );
}
1318135516 