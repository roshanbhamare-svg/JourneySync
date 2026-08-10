import { useState } from "react";
import { useParams } from "react-router-dom";
import { getLocalRideOptions } from "../services/transportService";
import { addPlacesToItinerary } from "../services/itineraryService";

// Emoji map for transport modes
const transportIcons = {
    "auto": "🛺",
    "auto rickshaw": "🛺",
    "rickshaw": "🛺",
    "metro": "🚇",
    "bus": "🚌",
    "city bus": "🚌",
    "taxi": "🚕",
    "cab": "🚕",
    "uber": "📱",
    "ola": "📱",
    "ride share": "📱",
    "shared auto": "🛺",
    "walk": "🚶",
    "walking": "🚶",
    "train": "🚆",
    "e-rickshaw": "🛺",
    "cycle rickshaw": "🚲"
};

const getTransportIcon = (name = "") => {
    const lower = name.toLowerCase().trim();
    for (const [key, emoji] of Object.entries(transportIcons)) {
        if (lower.includes(key)) return emoji;
    }
    return "🚗";
};

// Toast notification component
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
            <span>{type === "success" ? "✅" : "⚠️"}</span>
            {message}
        </div>
    );
}

function Transport() {
    const { tripId } = useParams();

    const [source, setSource] = useState("");
    const [destination, setDestination] = useState("");
    const [loading, setLoading] = useState(false);
    const [rideData, setRideData] = useState(null);
    const [error, setError] = useState("");
    const [toast, setToast] = useState(null);
    const [adding, setAdding] = useState(false);

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
            console.error(err);
            const msg = err?.response?.data?.message || "Failed to calculate routes. Please verify location names.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToItinerary = async () => {
        if (!rideData) return;
        setAdding(true);
        try {
            // Mapping estimatedFare string to integer for itinerary cost
            const fareClean = rideData.estimatedFare.replace(/[^0-9]/g, "");
            let costVal = parseInt(fareClean, 10);
            if (isNaN(costVal)) {
                // Try range (e.g. 80-120 -> pick average or lower)
                const numbers = rideData.estimatedFare.match(/\d+/g);
                if (numbers && numbers.length > 0) {
                    costVal = parseInt(numbers[0], 10);
                } else {
                    costVal = 100; // default fallback
                }
            }

            await addPlacesToItinerary({
                tripId,
                items: [
                    {
                        type: "transport",
                        name: `${rideData.recommendedTransport} Ride`,
                        description: `${rideData.source} → ${rideData.destination} (${rideData.distance} km, ${rideData.travelTime})`,
                        estimatedCost: costVal,
                        category: "transport",
                    },
                ],
            });
            showToast("Transport recommendation added to your itinerary! 🗺️");
        } catch (err) {
            console.error(err);
            showToast("Failed to add to itinerary. Please try again.", "error");
        } finally {
            setAdding(false);
        }
    };

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

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <div style={{ maxWidth: "720px", margin: "0 auto", padding: "8px 0 60px" }}>
                {/* Page header */}
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
                        🗺️ Local Route &amp; Ride Planner
                    </h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", margin: 0 }}>
                        Calculate precise road distance, travel times, and get custom local transport recommendations.
                    </p>
                </div>

                {/* Search Form */}
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
                        onSubmit={handleFindRide}
                        style={{ display: "flex", flexDirection: "column", gap: "20px" }}
                    >
                        {/* Source Location */}
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
                                className="ride-input"
                                type="text"
                                placeholder="e.g. Sai Baba Temple"
                                value={source}
                                onChange={(e) => setSource(e.target.value)}
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

                        {/* Divider */}
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

                        {/* Destination Location */}
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
                                className="ride-input"
                                type="text"
                                placeholder="e.g. Wet N Joy Water Park"
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
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

                        {/* Error Alert */}
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

                        {/* Submit Button */}
                        <button
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
                                    Calculating Road Distance &amp; Options...
                                </>
                            ) : (
                                <>🔍 Calculate Best Route</>
                            )}
                        </button>
                    </form>
                </div>

                {/* Redesigned Results Card */}
                {rideData && (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "24px",
                            animation: "fadeIn 0.45s ease",
                        }}
                    >
                        {/* Final Local Transport Card */}
                        <div style={{
                            background: "rgba(18,30,51,0.6)",
                            backdropFilter: "blur(20px)",
                            WebkitBackdropFilter: "blur(20px)",
                            border: "1px solid rgba(6,182,212,0.2)",
                            borderRadius: "20px",
                            padding: "28px",
                            boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
                            display: "flex",
                            flexDirection: "column",
                            gap: "20px"
                        }}>
                            {/* Route summary info */}
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                borderBottom: "1px solid rgba(255,255,255,0.08)",
                                paddingBottom: "16px",
                                flexWrap: "wrap",
                                gap: "12px"
                            }}>
                                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Route Journey</span>
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                                        <strong style={{ color: "#06b6d4" }}>{rideData.source}</strong>
                                        <span style={{ color: "var(--text-muted)" }}>→</span>
                                        <strong style={{ color: "#3b82f6" }}>{rideData.destination}</strong>
                                    </div>
                                </div>
                                <div style={{ display: "flex", gap: "16px" }}>
                                    <div style={{ textAlign: "right" }}>
                                        <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", display: "block" }}>Road Distance</span>
                                        <strong style={{ fontSize: "1.15rem", color: "#f8fafc" }}>{rideData.distance} km</strong>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", display: "block" }}>Travel Time</span>
                                        <strong style={{ fontSize: "1.15rem", color: "#f8fafc" }}>{rideData.travelTime}</strong>
                                    </div>
                                </div>
                            </div>

                            {/* Two-Column split: Recommended vs Alternative */}
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                                gap: "20px"
                            }}>
                                {/* Recommended Transport Card */}
                                <div style={{
                                    background: "rgba(6,182,212,0.04)",
                                    border: "1px solid rgba(6,182,212,0.18)",
                                    borderRadius: "16px",
                                    padding: "20px",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "14px"
                                }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                        <span style={{ fontSize: "2rem" }}>{getTransportIcon(rideData.recommendedTransport)}</span>
                                        <div>
                                            <span style={{ fontSize: "0.7rem", color: "#06b6d4", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", display: "block" }}>Recommended Transport</span>
                                            <strong style={{ fontSize: "1.2rem", color: "#f8fafc" }}>{rideData.recommendedTransport}</strong>
                                        </div>
                                    </div>

                                    <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: "10px", padding: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                                        <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", textTransform: "uppercase", display: "block", marginBottom: "2px" }}>Estimated Fare</span>
                                        <strong style={{ fontSize: "1.3rem", color: "#10b981" }}>{rideData.estimatedFare}</strong>
                                    </div>

                                    <p style={{ fontSize: "0.85rem", color: "#94a3b8", margin: 0, lineHeight: 1.5 }}>
                                        <strong>Why:</strong> {rideData.reason}
                                    </p>
                                </div>

                                {/* Alternative Option Card */}
                                <div style={{
                                    background: "rgba(255,255,255,0.02)",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                    borderRadius: "16px",
                                    padding: "20px",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "14px"
                                }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                        <span style={{ fontSize: "2rem" }}>{getTransportIcon(rideData.alternativeTransport)}</span>
                                        <div>
                                            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", display: "block" }}>Alternative Option</span>
                                            <strong style={{ fontSize: "1.2rem", color: "#f8fafc" }}>{rideData.alternativeTransport}</strong>
                                        </div>
                                    </div>

                                    <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: "10px", padding: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                                        <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", textTransform: "uppercase", display: "block", marginBottom: "2px" }}>Alternative Fare</span>
                                        <strong style={{ fontSize: "1.3rem", color: "#94a3b8" }}>{rideData.alternativeFare}</strong>
                                    </div>

                                    <p style={{ fontSize: "0.85rem", color: "#94a3b8", margin: 0, lineHeight: 1.5 }}>
                                        Useful as a secondary transit method to compare speed and cost.
                                    </p>
                                </div>
                            </div>

                            {/* Money Saving Tip */}
                            {rideData.moneySavingTip && (
                                <div style={{
                                    background: "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(5,150,105,0.08))",
                                    border: "1px solid rgba(16,185,129,0.25)",
                                    borderRadius: "14px",
                                    padding: "16px 20px",
                                    display: "flex",
                                    gap: "12px",
                                    alignItems: "flex-start"
                                }}>
                                    <div style={{
                                        width: "36px",
                                        height: "36px",
                                        background: "linear-gradient(135deg, #10b981, #059669)",
                                        borderRadius: "10px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "1.1rem",
                                        boxShadow: "0 4px 12px rgba(16,185,129,0.3)",
                                        flexShrink: 0
                                    }}>
                                        💰
                                    </div>
                                    <div>
                                        <span style={{
                                            fontFamily: "'Outfit', sans-serif",
                                            fontWeight: 700,
                                            fontSize: "0.85rem",
                                            color: "#10b981",
                                            display: "block",
                                            marginBottom: "4px",
                                            textTransform: "uppercase",
                                            letterSpacing: "0.05em"
                                        }}>
                                            AI Money Saving Tip
                                        </span>
                                        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", margin: 0, lineHeight: 1.5 }}>
                                            {rideData.moneySavingTip}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Add to itinerary action bar */}
                            <div style={{
                                borderTop: "1px solid rgba(255,255,255,0.08)",
                                paddingTop: "20px",
                                display: "flex",
                                justifyContent: "flex-end"
                            }}>
                                <button
                                    onClick={handleAddToItinerary}
                                    disabled={adding}
                                    style={{
                                        background: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "12px",
                                        padding: "14px 28px",
                                        fontFamily: "'Outfit', sans-serif",
                                        fontWeight: 700,
                                        fontSize: "0.95rem",
                                        cursor: adding ? "not-allowed" : "pointer",
                                        opacity: adding ? 0.75 : 1,
                                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                                        boxShadow: "0 4px 16px rgba(6,182,212,0.25)",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px"
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!adding) e.currentTarget.style.transform = "translateY(-2px)";
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!adding) e.currentTarget.style.transform = "translateY(0)";
                                    }}
                                >
                                    {adding ? "Adding..." : "➕ Add Route to Itinerary"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default Transport;