function PlaceCard({
    place,
    selected,
    onSelect
}) {

    return (
        <div className={`item-card ${selected ? "selected" : ""}`}>
            <div>
                <h3 className="item-card-title">{place.name}</h3>
                <p className="item-card-address">{place.address}</p>
            </div>

            <div className="item-card-footer">
                <span className="item-card-cost">₹{place.estimatedCost}</span>
                <button
                    className={selected ? "btn-danger" : "btn-secondary"}
                    onClick={() => onSelect(place)}
                >
                    {selected ? "Remove" : "Select"}
                </button>
            </div>
        </div>
    );
}

export default PlaceCard;