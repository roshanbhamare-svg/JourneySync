function RestaurantCard({
    restaurant,
    selected,
    onSelect
}) {

    return (
        <div className={`item-card ${selected ? "selected" : ""}`}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

                <div>
                    <h3 className="item-card-title">{restaurant.name}</h3>
                    {restaurant.address && (
                        <p className="item-card-address" style={{ marginBottom: '4px' }}>{restaurant.address}</p>
                    )}
                </div>

                {restaurant.description && (
                    <p style={{
                        fontSize: '0.875rem',
                        color: 'var(--text-secondary)',
                        lineHeight: '1.5',
                        margin: '0'
                    }}>
                        {restaurant.description}
                    </p>
                )}

                {restaurant.famousDishes && restaurant.famousDishes.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <span style={{
                            fontSize: '0.7rem',
                            color: 'var(--text-muted)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>
                            🍽 Famous Dishes
                        </span>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {restaurant.famousDishes.map((dish, i) => (
                                <span
                                    key={i}
                                    style={{
                                        fontSize: '0.75rem',
                                        padding: '3px 10px',
                                        borderRadius: '12px',
                                        background: 'rgba(245, 158, 11, 0.1)',
                                        color: '#fbbf24',
                                        border: '1px solid rgba(245, 158, 11, 0.2)'
                                    }}
                                >
                                    {dish}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {(restaurant.openingTime || restaurant.closingTime) && (
                    <div style={{
                        display: 'flex',
                        gap: '16px',
                        fontSize: '0.8rem',
                        flexWrap: 'wrap'
                    }}>
                        {restaurant.openingTime && (
                            <span style={{ color: 'var(--text-muted)' }}>
                                🕐 <strong style={{ color: 'var(--text-secondary)' }}>Opens:</strong> {restaurant.openingTime}
                            </span>
                        )}
                        {restaurant.closingTime && (
                            <span style={{ color: 'var(--text-muted)' }}>
                                🕙 <strong style={{ color: 'var(--text-secondary)' }}>Closes:</strong> {restaurant.closingTime}
                            </span>
                        )}
                    </div>
                )}
            </div>

            <div className="item-card-footer">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Avg Cost
                    </span>
                    <span className="item-card-cost">
                        {restaurant.averageCost || '₹300'}
                    </span>
                </div>
                <button
                    className={selected ? "btn-danger" : "btn-secondary"}
                    onClick={() => onSelect(restaurant)}
                >
                    {selected ? "Remove" : "Add to Trip"}
                </button>
            </div>
        </div>
    );
}

export default RestaurantCard;