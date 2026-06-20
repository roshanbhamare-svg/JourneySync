function RestaurantCard({
    restaurant,
    selected,
    onSelect
}) {

    return (
        <div
            style={{
                border: "1px solid black",
                padding: "10px",
                margin: "10px"
            }}
        >
            <h3>
                {restaurant.name}
            </h3>

            <p>
                {restaurant.address}
            </p>

            <p>
                Cost: ₹{restaurant.estimatedCost}
            </p>

            <button
                onClick={() =>
                    onSelect(restaurant)
                }
            >
                {
                    selected
                        ? "Remove"
                        : "Select"
                }
            </button>

        </div>
    );
}

export default RestaurantCard;