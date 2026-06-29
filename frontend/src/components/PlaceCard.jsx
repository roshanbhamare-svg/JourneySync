function PlaceCard({
    place,
    selected,
    onSelect
}) {

    return (
        <div className={`item-card ${selected ? "selected" : ""}`}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

                <div>
                    <h3 className="item-card-title">{place.name}</h3>
                    {place.address && (
                        <p className="item-card-address" style={{ marginBottom: '4px' }}>{place.address}</p>
                    )}
                </div>

                {place.description && (
                    <p style={{
                        fontSize: '0.875rem',
                        color: 'var(--text-secondary)',
                        lineHeight: '1.5',
                        margin: '0'
                    }}>
                        {place.description}
                    </p>
                )}

                {(place.openingTime || place.closingTime) && (
                    <div style={{
                        display: 'flex',
                        gap: '16px',
                        fontSize: '0.8rem',
                        flexWrap: 'wrap'
                    }}>
                        {place.openingTime && (
                            <span style={{ color: 'var(--text-muted)' }}>
                                🕐 <strong style={{ color: 'var(--text-secondary)' }}>Opens:</strong> {place.openingTime}
                            </span>
                        )}
                        {place.closingTime && (
                            <span style={{ color: 'var(--text-muted)' }}>
                                🕙 <strong style={{ color: 'var(--text-secondary)' }}>Closes:</strong> {place.closingTime}
                            </span>
                        )}
                    </div>
                )}
            </div>

            <div className="item-card-footer">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Entry Fee
                    </span>
                    <span className="item-card-cost">
                        {place.estimatedFare || '₹100'}
                    </span>
                </div>
                <button
                    className={selected ? "btn-danger" : "btn-secondary"}
                    onClick={() => onSelect(place)}
                >
                    {selected ? "Remove" : "Add to Trip"}
                </button>
            </div>
        </div>
    );
}

export default PlaceCard;