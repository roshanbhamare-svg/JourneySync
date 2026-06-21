function TripCard({ trip, onDelete, onOpen }) {
  return (
    <div
      style={{
        border: "1px solid black",
        padding: "10px",
        margin: "10px"
      }}
    >
      <h3>{trip.destination}</h3>

      <p>Source : {trip.source}</p>

      <p>Days : {trip.days}</p>

      <p>People : {trip.people}</p>

      <p>Budget : ₹{trip.totalBudget}</p>

      <button onClick={() => onOpen(trip._id)}>
        Select Trip
      </button>

      <button onClick={() => onDelete(trip._id)}>
        Delete Trip
      </button>
    </div>
  );
}

export default TripCard;