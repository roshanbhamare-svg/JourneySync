function PlaceCard({
    place,
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
            <h3>{place.name}</h3>

            <p>{place.address}</p>

            <p>
                Cost: ₹{place.estimatedCost}
            </p>

            <button
                onClick={() =>
                    onSelect(place)
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

export default PlaceCard;