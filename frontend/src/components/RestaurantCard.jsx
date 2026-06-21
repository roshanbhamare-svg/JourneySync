function RestaurantCard({
    restaurant,
    selected,
    onSelect
}) {

    return (
        <div className={`item-card ${selected ? "selected" : ""}`}>
            <div>
                <h3 className="item-card-title">{restaurant.name}</h3>
                <p className="item-card-address">{restaurant.address}</p>
            </div>

            <div className="item-card-footer">
                <span className="item-card-cost">₹{restaurant.estimatedCost}</span>
                <button
                    className={selected ? "btn-danger" : "btn-secondary"}
                    onClick={() => onSelect(restaurant)}
                >
                    {selected ? "Remove" : "Select"}
                </button>
            </div>
        </div>
    );
}

export default RestaurantCard;