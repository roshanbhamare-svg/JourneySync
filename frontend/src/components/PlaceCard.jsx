import { useState } from "react";

const PLACEHOLDER_IMG =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='220' viewBox='0 0 400 220'%3E%3Crect width='400' height='220' fill='%230b1322'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='48' fill='%23334155'%3E🏛️%3C/text%3E%3C/svg%3E";

/** Render up to 5 filled/empty stars from a rating out of 5 */
function StarRating({ rating }) {
    if (!rating) return null;
    const filled = Math.round(rating);
    return (
        <span style={{ display: "inline-flex", gap: "2px", alignItems: "center" }}>
            {[1, 2, 3, 4, 5].map((i) => (
                <span
                    key={i}
                    style={{
                        fontSize: "0.75rem",
                        color: i <= filled ? "#f59e0b" : "#334155",
                    }}
                >
                    ★
                </span>
            ))}
            <span
                style={{
                    fontSize: "0.75rem",
                    color: "#94a3b8",
                    marginLeft: "4px",
                    fontFamily: "'Outfit', sans-serif",
                }}
            >
                {rating.toFixed(1)}
            </span>
        </span>
    );
}

function InfoRow({ icon, label, value }) {
    if (!value) return null;
    return (
        <div
            style={{
                display: "flex",
                gap: "8px",
                alignItems: "flex-start",
                fontSize: "0.82rem",
            }}
        >
            <span style={{ flexShrink: 0, marginTop: "1px" }}>{icon}</span>
            <span>
                <span
                    style={{
                        color: "#64748b",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        fontSize: "0.7rem",
                        letterSpacing: "0.04em",
                        marginRight: "4px",
                    }}
                >
                    {label}:
                </span>
                <span style={{ color: "#94a3b8" }}>{value}</span>
            </span>
        </div>
    );
}

function PlaceCard({ place, selected, onSelect }) {
    const [imgError, setImgError] = useState(false);

    const imgSrc = !imgError && place.photo ? place.photo : PLACEHOLDER_IMG;

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                background: selected
                    ? "rgba(6,182,212,0.06)"
                    : "rgba(18,30,51,0.55)",
                border: selected
                    ? "1.5px solid #06b6d4"
                    : "1px solid rgba(6,182,212,0.12)",
                borderRadius: "18px",
                overflow: "hidden",
                transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
                boxShadow: selected
                    ? "0 0 24px rgba(6,182,212,0.2), 0 8px 32px rgba(0,0,0,0.4)"
                    : "0 4px 24px rgba(0,0,0,0.35)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
            }}
            onMouseEnter={(e) => {
                if (!selected) {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow =
                        "0 12px 40px rgba(0,0,0,0.5), 0 0 16px rgba(6,182,212,0.12)";
                    e.currentTarget.style.borderColor = "rgba(6,182,212,0.25)";
                }
            }}
            onMouseLeave={(e) => {
                if (!selected) {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.35)";
                    e.currentTarget.style.borderColor = "rgba(6,182,212,0.12)";
                }
            }}
        >
            {/* ── Photo ── */}
            <div
                style={{
                    position: "relative",
                    width: "100%",
                    height: "190px",
                    flexShrink: 0,
                    overflow: "hidden",
                    background: "#0b1322",
                }}
            >
                <img
                    src={imgSrc}
                    alt={place.name}
                    onError={() => setImgError(true)}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                        transition: "transform 0.4s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                />

                {/* Category pill */}
                {place.category && (
                    <span
                        style={{
                            position: "absolute",
                            top: "10px",
                            left: "10px",
                            background: "rgba(6,182,212,0.85)",
                            color: "#fff",
                            fontSize: "0.68rem",
                            fontWeight: 700,
                            padding: "4px 10px",
                            borderRadius: "999px",
                            fontFamily: "'Outfit', sans-serif",
                            letterSpacing: "0.04em",
                            backdropFilter: "blur(8px)",
                            textTransform: "uppercase",
                        }}
                    >
                        {place.category}
                    </span>
                )}

                {/* Rating badge */}
                {place.rating && (
                    <span
                        style={{
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                            background: "rgba(0,0,0,0.7)",
                            color: "#f59e0b",
                            fontSize: "0.8rem",
                            fontWeight: 700,
                            padding: "4px 10px",
                            borderRadius: "999px",
                            fontFamily: "'Outfit', sans-serif",
                            backdropFilter: "blur(8px)",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                        }}
                    >
                        ★ {place.rating.toFixed(1)}
                        {place.reviewCount && (
                            <span
                                style={{
                                    fontSize: "0.65rem",
                                    color: "#94a3b8",
                                    fontWeight: 400,
                                }}
                            >
                                ({place.reviewCount})
                            </span>
                        )}
                    </span>
                )}
            </div>

            {/* ── Content ── */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    padding: "16px",
                    flex: 1,
                }}
            >
                {/* Name */}
                <h3
                    style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontWeight: 700,
                        fontSize: "1.05rem",
                        color: "#f8fafc",
                        margin: 0,
                        lineHeight: 1.3,
                    }}
                >
                    {place.name}
                </h3>

                {/* AI Description */}
                {place.description && (
                    <p
                        style={{
                            fontSize: "0.83rem",
                            color: "#94a3b8",
                            lineHeight: 1.55,
                            margin: 0,
                        }}
                    >
                        {place.description}
                    </p>
                )}

                {/* Info rows */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <InfoRow icon="📍" label="Address" value={place.address} />
                    <InfoRow
                        icon="🕐"
                        label="Hours"
                        value={
                            place.openingHours || place.closingHours
                                ? `${place.openingHours || ""}${place.openingHours && place.closingHours ? " – " : ""}${place.closingHours || ""}`
                                : null
                        }
                    />
                    <InfoRow icon="🎟️" label="Entry Fee" value={place.estimatedEntryFee} />
                    <InfoRow icon="⏱️" label="Visit Duration" value={place.recommendedVisitDuration} />
                    <InfoRow icon="☀️" label="Best Time" value={place.bestTimeToVisit} />
                    {place.website && (
                        <div style={{ fontSize: "0.82rem", display: "flex", gap: "8px", alignItems: "center" }}>
                            <span>🌐</span>
                            <a
                                href={place.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    color: "#06b6d4",
                                    fontSize: "0.8rem",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    maxWidth: "200px",
                                    display: "inline-block",
                                }}
                            >
                                {place.website.replace(/^https?:\/\/(www\.)?/, "")}
                            </a>
                        </div>
                    )}
                </div>

                {/* Travel tips */}
                {place.travelTips && (
                    <div
                        style={{
                            background: "rgba(6,182,212,0.06)",
                            border: "1px solid rgba(6,182,212,0.15)",
                            borderLeft: "3px solid #06b6d4",
                            borderRadius: "8px",
                            padding: "8px 12px",
                            fontSize: "0.8rem",
                            color: "#94a3b8",
                            lineHeight: 1.5,
                        }}
                    >
                        <span
                            style={{
                                color: "#06b6d4",
                                fontWeight: 700,
                                fontSize: "0.7rem",
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                                display: "block",
                                marginBottom: "3px",
                            }}
                        >
                            💡 Travel Tip
                        </span>
                        {place.travelTips}
                    </div>
                )}

                {/* Footer – Add to Itinerary */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        marginTop: "auto",
                        paddingTop: "10px",
                        borderTop: "1px solid rgba(255,255,255,0.06)",
                    }}
                >
                    <button
                        onClick={() => onSelect(place)}
                        style={{
                            background: selected
                                ? "linear-gradient(135deg,#f43f5e,#be123c)"
                                : "linear-gradient(135deg,#06b6d4,#3b82f6)",
                            color: "#fff",
                            border: "none",
                            borderRadius: "10px",
                            padding: "9px 20px",
                            fontFamily: "'Outfit', sans-serif",
                            fontWeight: 600,
                            fontSize: "0.85rem",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            boxShadow: selected
                                ? "0 4px 14px rgba(244,63,94,0.3)"
                                : "0 4px 14px rgba(6,182,212,0.25)",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                    >
                        {selected ? "✕ Remove" : "＋ Add to Itinerary"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PlaceCard;