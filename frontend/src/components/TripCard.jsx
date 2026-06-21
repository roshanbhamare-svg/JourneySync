function TripCard({ trip, onDelete, onOpen }) {
  return (
    <div className="glass-card trip-card">
      <div>
        <div className="trip-card-header">
          <div>
            <h3 className="trip-card-destination">{trip.destination}</h3>
            <div className="trip-card-source">from {trip.source}</div>
          </div>
        </div>

        <div className="trip-card-details">
          <div className="trip-detail-item">
            <span className="trip-detail-label">Duration</span>
            <span className="trip-detail-value">{trip.days} {trip.days === 1 ? "Day" : "Days"}</span>
          </div>
          <div className="trip-detail-item">
            <span className="trip-detail-label">Travelers</span>
            <span className="trip-detail-value">{trip.people} {trip.people === 1 ? "Person" : "People"}</span>
          </div>
          <div className="trip-detail-item">
            <span className="trip-detail-label">Budget</span>
            <span className="trip-detail-value" style={{ color: "var(--success)" }}>₹{trip.totalBudget}</span>
          </div>
        </div>
      </div>

      <div className="trip-card-actions">
        <button className="btn-primary" onClick={() => onOpen(trip._id)}>
          Open
        </button>
        <button className="btn-danger" onClick={() => onDelete(trip._id)}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default TripCard;