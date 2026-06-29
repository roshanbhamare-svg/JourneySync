import { useState } from "react";
import { useParams } from "react-router-dom";
import { getLocalRideOptions } from "../services/transportService";
import { addPlacesToItinerary } from "../services/itineraryService";

// ── Icon helpers (inline SVG so no extra deps) ─────────────────────────────
const icons = {
    Metro:       "🚇",
    Bus:         "🚌",
    Auto:        "🛺",
    Taxi:        "🚕",
    "Ride Share": "📱",
};

const modeColors = {
    Metro:        { from: "#06b6d4", to: "#3b82f6" },
    Bus:          { from: "#10b981", to: "#059669" },
    Auto:         { from: "#f59e0b", to: "#d97706" },
    Taxi:         { from: "#8b5cf6", to: "#6d28d9" },
    "Ride Share": { from: "#f43f5e", to: "#be123c" },
};

// ── Toast notification ──────────────────────────────────────────────────────
function Toast({ message, type, onClose }) {
    return (
        <div
            style={{
                position: "fixed",
                bottom: "32px",
                left: "50%",
                transform: "translateX(-50%)",
                background: type === "success"
                    ? "linear-gradient(135deg,#10b981,#059669)"
                    : "linear-gradient(135deg,#f43f5e,#be123c)",
                color: "#fff",
                padding: "14px 28px",
                borderRadius: "12px",
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 600,
                fontSize: "0.95rem",
                boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                zIndex: 9999,
                display: "flex",
                alignItems: "center",
                gap: "10px",
                animation: "slideUp 0.3s ease",
                cursor: "pointer",
            }}
            onClick={onClose}
        >
            <span>{type === "success" ? "✅" : "❌"}</span>
            {message}
        </div>
    );
}

// ── Transport option card ───────────────────────────────────────────────────
function OptionCard({ option, source, destination, tripId, onAdded }) {
    const [adding, setAdding] = useState(false);
    const colors = modeColors[option.type] || { from: "#06b6d4", to: "#3b82f6" };
    const emoji  = icons[option.type] || "🚗";

    const handleChoose = async () => {
        if (!option.available) return;
        setAdding(true);
        try {
            await addPlacesToItinerary({
                tripId,
                items: [
                    {
                        type: "transport",
                        name: `${option.type} Ride`,
                        description: `${source} → ${destination}`,
                        estimatedCost: option.estimatedFare,
                        category: "transport",
                    },
                ],
            });
            onAdded(`${option.type} Ride added to your itinerary! 🎉`);
        } catch (err) {
            console.error(err);
            onAdded("Failed to add to itinerary. Try again.", "error");
        } finally {
            setAdding(false);
        }
    };

    return (
        <div
            style={{
                position: "relative",
                background: option.available
                    ? "rgba(255,255,255,0.03)"
                    : "rgba(255,255,255,0.01)",
                border: option.available
                    ? "1px solid rgba(255,255,255,0.1)"
                    : "1px solid rgba(255,255,255,0.04)",
                borderRadius: "16px",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                opacity: option.available ? 1 : 0.4,
                transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1), box-shadow 0.25s ease, border-color 0.25s ease",
                cursor: option.available ? "default" : "not-allowed",
            }}
            onMouseEnter={e => {
                if (option.available) {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = `0 16px 40px rgba(0,0,0,0.35)`;
                    e.currentTarget.style.borderColor = `${colors.from}55`;
                }
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = option.available
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(255,255,255,0.04)";
            }}
        >
            {/* Mode header */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{
                    fontSize: "1.6rem",
                    lineHeight: 1,
                    background: `linear-gradient(135deg, ${colors.from}, ${colors.to})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.3))",
                }}>
                    {emoji}
                </span>
                <span style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 700,
                    fontSize: "1.05rem",
                    color: "var(--text-primary)",
                }}>
                    {option.type}
                </span>
                {!option.available && (
                    <span style={{
                        marginLeft: "auto",
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        color: "var(--text-muted)",
                        background: "rgba(255,255,255,0.06)",
                        padding: "3px 8px",
                        borderRadius: "999px",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                    }}>
                        Unavailable
                    </span>
                )}
            </div>

            {/* Fare & Time row */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "8px",
            }}>
                <div style={{
                    background: "rgba(255,255,255,0.04)",
                    borderRadius: "10px",
                    padding: "10px 12px",
                }}>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
                        Fare
                    </div>
                    <div style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontWeight: 700,
                        fontSize: "1.15rem",
                        background: `linear-gradient(135deg, ${colors.from}, ${colors.to})`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}>
                        ₹{option.estimatedFare}
                    </div>
                </div>
                <div style={{
                    background: "rgba(255,255,255,0.04)",
                    borderRadius: "10px",
                    padding: "10px 12px",
                }}>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
                        Time
                    </div>
                    <div style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontWeight: 700,
                        fontSize: "1rem",
                        color: "var(--text-primary)",
                    }}>
                        {option.estimatedTime}
                    </div>
                </div>
            </div>

            {/* Choose button */}
            <button
                id={`choose-${option.type.replace(/\s+/g, "-").toLowerCase()}`}
                onClick={handleChoose}
                disabled={!option.available || adding}
                style={{
                    width: "100%",
                    padding: "11px",
                    border: "none",
                    borderRadius: "10px",
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    cursor: option.available && !adding ? "pointer" : "not-allowed",
                    background: option.available
                        ? `linear-gradient(135deg, ${colors.from}, ${colors.to})`
                        : "rgba(255,255,255,0.06)",
                    color: "#fff",
                    opacity: adding ? 0.7 : 1,
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    boxShadow: option.available
                        ? `0 4px 16px ${colors.from}33`
                        : "none",
                }}
                onMouseEnter={e => {
                    if (option.available && !adding) {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = `0 8px 24px ${colors.from}55`;
                    }
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = option.available
                        ? `0 4px 16px ${colors.from}33`
                        : "none";
                }}
            >
                {adding ? "Adding…" : option.available ? "Choose" : "Not Available"}
            </button>
        </div>
    );
}

// ── Main page ───────────────────────────────────────────────────────────────
function Transport() {

    const { tripId } = useParams();

    const [source,      setSource]      = useState("");
    const [destination, setDestination] = useState("");
    const [loading,     setLoading]     = useState(false);
    const [rideData,    setRideData]    = useState(null);
    const [error,       setError]       = useState("");
    const [toast,       setToast]       = useState(null);

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    const handleFindRide = async (e) => {
        e.preventDefault();
        setError("");
        setRideData(null);
        setLoading(true);

        try {
            const data = await getLocalRideOptions({ source, destination });
            setRideData(data);
        } catch (err) {
            const msg = err?.response?.data?.message || "Something went wrong. Please try again.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const recommendedColor = rideData
        ? (modeColors[rideData.recommendedTransport] || { from: "#06b6d4", to: "#3b82f6" })
        : { from: "#06b6d4", to: "#3b82f6" };

    return (
        <>
            <style>{`
                @keyframes slideUp {
                    from { transform: translateX(-50%) translateY(20px); opacity: 0; }
                    to   { transform: translateX(-50%) translateY(0);    opacity: 1; }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(16px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                .ride-input:focus {
                    border-color: #06b6d4 !important;
                    box-shadow: 0 0 0 3px rgba(6,182,212,0.15) !important;
                }
                .find-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 28px rgba(6,182,212,0.4), 0 0 24px rgba(6,182,212,0.25) !important;
                }
                .find-btn:active:not(:disabled) {
                    transform: translateY(0);
                }
            `}</style>

            {/* Toast */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <div style={{ maxWidth: "720px", margin: "0 auto", padding: "8px 0 60px" }}>

                {/* ── Page header ── */}
                <div style={{ marginBottom: "32px" }}>
                    <h1 style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: "2rem",
                        fontWeight: 800,
                        background: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        marginBottom: "8px",
                        letterSpacing: "-0.02em",
                    }}>
                        🗺️ Local Ride Planner
                    </h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", margin: 0 }}>
                        Find the cheapest &amp; fastest way to travel between two local spots.
                    </p>
                </div>

                {/* ── Search form ── */}
                <div style={{
                    background: "rgba(18,30,51,0.55)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    border: "1px solid rgba(6,182,212,0.15)",
                    borderRadius: "20px",
                    padding: "28px",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                    marginBottom: "28px",
                }}>
                    <form
                        id="local-ride-form"
                        onSubmit={handleFindRide}
                        style={{ display: "flex", flexDirection: "column", gap: "20px" }}
                    >
                        {/* Source */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <label style={{
                                fontFamily: "'Outfit', sans-serif",
                                fontSize: "0.8rem",
                                fontWeight: 600,
                                color: "#06b6d4",
                                textTransform: "uppercase",
                                letterSpacing: "0.08em",
                            }}>
                                📍 Source Location
                            </label>
                            <input
                                id="source-input"
                                className="ride-input"
                                type="text"
                                placeholder="e.g. Juhu Beach, Mumbai"
                                value={source}
                                onChange={e => setSource(e.target.value)}
                                required
                                style={{
                                    background: "rgba(255,255,255,0.04)",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    borderRadius: "12px",
                                    padding: "14px 18px",
                                    color: "var(--text-primary)",
                                    fontSize: "0.95rem",
                                    fontFamily: "'Inter', sans-serif",
                                    outline: "none",
                                    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                                    width: "100%",
                                    boxSizing: "border-box",
                                }}
                            />
                        </div>

                        {/* Arrow divider */}
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            padding: "0 4px",
                        }}>
                            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.07)" }} />
                            <div style={{
                                width: "34px",
                                height: "34px",
                                borderRadius: "50%",
                                background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "1rem",
                                boxShadow: "0 4px 12px rgba(6,182,212,0.3)",
                                flexShrink: 0,
                            }}>
                                ↓
                            </div>
                            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.07)" }} />
                        </div>

                        {/* Destination */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <label style={{
                                fontFamily: "'Outfit', sans-serif",
                                fontSize: "0.8rem",
                                fontWeight: 600,
                                color: "#3b82f6",
                                textTransform: "uppercase",
                                letterSpacing: "0.08em",
                            }}>
                                🏁 Destination Location
                            </label>
                            <input
                                id="destination-input"
                                className="ride-input"
                                type="text"
                                placeholder="e.g. Andheri West, Mumbai"
                                value={destination}
                                onChange={e => setDestination(e.target.value)}
                                required
                                style={{
                                    background: "rgba(255,255,255,0.04)",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    borderRadius: "12px",
                                    padding: "14px 18px",
                                    color: "var(--text-primary)",
                                    fontSize: "0.95rem",
                                    fontFamily: "'Inter', sans-serif",
                                    outline: "none",
                                    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                                    width: "100%",
                                    boxSizing: "border-box",
                                }}
                            />
                        </div>

                        {/* Error */}
                        {error && (
                            <div style={{
                                background: "rgba(244,63,94,0.12)",
                                border: "1px solid rgba(244,63,94,0.3)",
                                borderRadius: "10px",
                                padding: "12px 16px",
                                color: "#f43f5e",
                                fontSize: "0.9rem",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                            }}>
                                <span>⚠️</span> {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            id="find-ride-btn"
                            type="submit"
                            className="find-btn"
                            disabled={loading}
                            style={{
                                background: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
                                border: "none",
                                borderRadius: "12px",
                                padding: "15px 24px",
                                color: "#fff",
                                fontFamily: "'Outfit', sans-serif",
                                fontWeight: 700,
                                fontSize: "1rem",
                                cursor: loading ? "not-allowed" : "pointer",
                                opacity: loading ? 0.75 : 1,
                                transition: "transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease",
                                boxShadow: "0 4px 16px rgba(6,182,212,0.3)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "10px",
                                letterSpacing: "0.02em",
                            }}
                        >
                            {loading ? (
                                <>
                                    <span style={{
                                        width: "18px",
                                        height: "18px",
                                        border: "2px solid rgba(255,255,255,0.3)",
                                        borderTopColor: "#fff",
                                        borderRadius: "50%",
                                        display: "inline-block",
                                        animation: "spin 0.8s linear infinite",
                                    }} />
                                    Finding Best Rides…
                                </>
                            ) : (
                                <>🔍 Find Best Local Ride</>
                            )}
                        </button>
                    </form>
                </div>

                {/* ── Results card ── */}
                {rideData && (
                    <div
                        id="ride-results"
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "20px",
                            animation: "fadeIn 0.45s ease",
                        }}
                    >
                        {/* Header summary card */}
                        <div style={{
                            background: "rgba(18,30,51,0.6)",
                            backdropFilter: "blur(20px)",
                            WebkitBackdropFilter: "blur(20px)",
                            border: "1px solid rgba(6,182,212,0.2)",
                            borderRadius: "20px",
                            padding: "24px 28px",
                            boxShadow: "0 8px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(6,182,212,0.06)",
                        }}>
                            {/* Title */}
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                marginBottom: "20px",
                                paddingBottom: "16px",
                                borderBottom: "1px solid rgba(255,255,255,0.07)",
                            }}>
                                <div style={{
                                    background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
                                    borderRadius: "10px",
                                    width: "38px",
                                    height: "38px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "1.1rem",
                                    boxShadow: "0 4px 12px rgba(6,182,212,0.3)",
                                    flexShrink: 0,
                                }}>
                                    🚀
                                </div>
                                <h2 style={{
                                    fontFamily: "'Outfit', sans-serif",
                                    fontWeight: 800,
                                    fontSize: "1.25rem",
                                    color: "var(--text-primary)",
                                    margin: 0,
                                }}>
                                    Best Local Ride
                                </h2>
                            </div>

                            {/* Route info */}
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                marginBottom: "20px",
                                flexWrap: "wrap",
                            }}>
                                <span style={{
                                    fontFamily: "'Outfit', sans-serif",
                                    fontWeight: 700,
                                    fontSize: "1rem",
                                    color: "#06b6d4",
                                    background: "rgba(6,182,212,0.1)",
                                    padding: "6px 14px",
                                    borderRadius: "999px",
                                    border: "1px solid rgba(6,182,212,0.2)",
                                }}>
                                    📍 {rideData.source}
                                </span>
                                <span style={{ color: "var(--text-muted)", fontSize: "1.2rem" }}>→</span>
                                <span style={{
                                    fontFamily: "'Outfit', sans-serif",
                                    fontWeight: 700,
                                    fontSize: "1rem",
                                    color: "#3b82f6",
                                    background: "rgba(59,130,246,0.1)",
                                    padding: "6px 14px",
                                    borderRadius: "999px",
                                    border: "1px solid rgba(59,130,246,0.2)",
                                }}>
                                    🏁 {rideData.destination}
                                </span>
                            </div>

                            {/* Stats row */}
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(3, 1fr)",
                                gap: "12px",
                                marginBottom: "20px",
                            }}>
                                {/* Distance */}
                                <div style={{
                                    background: "rgba(255,255,255,0.04)",
                                    borderRadius: "12px",
                                    padding: "14px 16px",
                                    textAlign: "center",
                                }}>
                                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>
                                        Distance
                                    </div>
                                    <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "1.25rem", color: "var(--text-primary)" }}>
                                        {rideData.distance} km
                                    </div>
                                </div>
                                {/* Recommended */}
                                <div style={{
                                    background: `linear-gradient(135deg, ${recommendedColor.from}1a, ${recommendedColor.to}1a)`,
                                    border: `1px solid ${recommendedColor.from}33`,
                                    borderRadius: "12px",
                                    padding: "14px 16px",
                                    textAlign: "center",
                                }}>
                                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>
                                        Recommended
                                    </div>
                                    <div style={{
                                        fontFamily: "'Outfit', sans-serif",
                                        fontWeight: 700,
                                        fontSize: "1.1rem",
                                        background: `linear-gradient(135deg, ${recommendedColor.from}, ${recommendedColor.to})`,
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                    }}>
                                        {icons[rideData.recommendedTransport] || "🚗"} {rideData.recommendedTransport}
                                    </div>
                                </div>
                                {/* Travel time */}
                                <div style={{
                                    background: "rgba(255,255,255,0.04)",
                                    borderRadius: "12px",
                                    padding: "14px 16px",
                                    textAlign: "center",
                                }}>
                                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>
                                        Est. Time
                                    </div>
                                    <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "var(--text-primary)" }}>
                                        ⏱ {rideData.estimatedTravelTime}
                                    </div>
                                </div>
                            </div>

                            {/* Reason */}
                            {rideData.reason && (
                                <div style={{
                                    background: `linear-gradient(135deg, ${recommendedColor.from}0f, ${recommendedColor.to}0f)`,
                                    border: `1px solid ${recommendedColor.from}22`,
                                    borderLeft: `3px solid ${recommendedColor.from}`,
                                    borderRadius: "10px",
                                    padding: "12px 16px",
                                    color: "var(--text-secondary)",
                                    fontSize: "0.9rem",
                                    lineHeight: "1.5",
                                }}>
                                    <strong style={{ color: "var(--text-primary)", marginRight: "4px" }}>💡 Why?</strong>
                                    {rideData.reason}
                                </div>
                            )}
                        </div>

                        {/* ── Available options grid ── */}
                        <div>
                            <h3 style={{
                                fontFamily: "'Outfit', sans-serif",
                                fontWeight: 700,
                                fontSize: "1rem",
                                color: "var(--text-secondary)",
                                textTransform: "uppercase",
                                letterSpacing: "0.07em",
                                marginBottom: "14px",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                            }}>
                                <span style={{
                                    width: "4px",
                                    height: "18px",
                                    background: "linear-gradient(135deg,#06b6d4,#3b82f6)",
                                    borderRadius: "4px",
                                    display: "inline-block",
                                }} />
                                Available Options
                            </h3>
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                                gap: "14px",
                            }}>
                                {rideData.options.map((option) => (
                                    <OptionCard
                                        key={option.type}
                                        option={option}
                                        source={rideData.source}
                                        destination={rideData.destination}
                                        tripId={tripId}
                                        onAdded={showToast}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* ── AI Money Saving Suggestion ── */}
                        {rideData.moneySavingSuggestion && (
                            <div style={{
                                background: "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(5,150,105,0.08))",
                                border: "1px solid rgba(16,185,129,0.25)",
                                borderRadius: "16px",
                                padding: "20px 24px",
                                display: "flex",
                                gap: "14px",
                                alignItems: "flex-start",
                            }}>
                                <div style={{
                                    width: "42px",
                                    height: "42px",
                                    background: "linear-gradient(135deg, #10b981, #059669)",
                                    borderRadius: "12px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "1.2rem",
                                    boxShadow: "0 4px 14px rgba(16,185,129,0.3)",
                                    flexShrink: 0,
                                }}>
                                    💰
                                </div>
                                <div>
                                    <div style={{
                                        fontFamily: "'Outfit', sans-serif",
                                        fontWeight: 700,
                                        fontSize: "0.9rem",
                                        color: "#10b981",
                                        marginBottom: "6px",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.05em",
                                    }}>
                                        AI Money Saving Tip
                                    </div>
                                    <div style={{
                                        color: "var(--text-secondary)",
                                        fontSize: "0.95rem",
                                        lineHeight: "1.55",
                                    }}>
                                        {rideData.moneySavingSuggestion}
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                )}
            </div>
        </>
    );
}

export default Transport;