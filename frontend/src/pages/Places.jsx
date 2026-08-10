import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PlaceCard from "../components/PlaceCard";
import { getPlaces } from "../services/placesService";
import { addPlacesToItinerary } from "../services/itineraryService";

function Places() {
    const { tripId } = useParams();
    const [places, setPlaces] = useState([]);
    const [selectedPlaces, setSelectedPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [destination, setDestination] = useState("");

    useEffect(() => {
        loadPlaces();
    }, [tripId]);

    const loadPlaces = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await getPlaces(tripId);
            setPlaces(data.places || []);
            setDestination(data.destination || "");
        } catch (err) {
            console.error(err);
            setError(err?.response?.data?.message || "Failed to load tourist attractions. Please check your connection and try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (place) => {
        const exists = selectedPlaces.find((item) => item.placeId === place.placeId);
        if (exists) {
            setSelectedPlaces(selectedPlaces.filter((item) => item.placeId !== place.placeId));
        } else {
            setSelectedPlaces([...selectedPlaces, place]);
        }
    };

    const handleConfirm = async () => {
        if (selectedPlaces.length === 0) return;
        try {
            const itineraryItems = selectedPlaces.map((place) => ({
                tripId,
                type: "place",
                name: place.name,
                category: place.category || "place",
                estimatedCost: place.estimatedCost || 100,
            }));

            await addPlacesToItinerary({
                tripId,
                items: itineraryItems,
            });

            alert("Attractions successfully added to your itinerary!");
            setSelectedPlaces([]); // Reset selection on success
        } catch (err) {
            console.error(err);
            alert("Failed to add selected attractions to itinerary. Please try again.");
        }
    };

    return (
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "16px 0 80px" }}>
            {/* Header */}
            <div style={{ marginBottom: "32px" }}>
                <h1 style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: "2.2rem",
                    fontWeight: 800,
                    background: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    marginBottom: "8px",
                    letterSpacing: "-0.02em",
                }}>
                    🏛️ Explore Attractions {destination ? `in ${destination}` : ""}
                </h1>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", margin: 0 }}>
                    Discover famous sightseeing locations, monuments, and viewpoints.
                </p>
            </div>

            {/* Error Message */}
            {error && (
                <div style={{
                    background: "rgba(244,63,94,0.1)",
                    border: "1px solid rgba(244,63,94,0.25)",
                    borderRadius: "14px",
                    padding: "16px 20px",
                    color: "#f43f5e",
                    fontSize: "0.95rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "24px",
                    fontFamily: "'Inter', sans-serif"
                }}>
                    <span>⚠️</span> {error}
                </div>
            )}

            {/* Loading skeleton / spinner */}
            {loading ? (
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "300px",
                    gap: "16px"
                }}>
                    <div style={{
                        width: "48px",
                        height: "48px",
                        border: "4px solid rgba(6,182,212,0.15)",
                        borderTopColor: "#06b6d4",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                    }} />
                    <p style={{
                        color: "var(--text-secondary)",
                        fontFamily: "'Outfit', sans-serif",
                        fontWeight: 500
                    }}>
                        Fetching Foursquare Places &amp; generating guide details...
                    </p>
                </div>
            ) : places.length === 0 ? (
                <div style={{
                    textAlign: "center",
                    padding: "60px 20px",
                    background: "rgba(18,30,51,0.3)",
                    borderRadius: "20px",
                    border: "1px solid rgba(255,255,255,0.05)"
                }}>
                    <span style={{ fontSize: "2.5rem" }}>📍</span>
                    <h3 style={{ marginTop: "16px", color: "var(--text-primary)" }}>No places found</h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", maxWidth: "400px", margin: "8px auto 0" }}>
                        We couldn't find any attractions for "{destination || "this city"}". Try updating the trip destination to a larger city.
                    </p>
                </div>
            ) : (
                <div className="cards-grid">
                    {places.map((place) => (
                        <PlaceCard
                            key={place.placeId}
                            place={place}
                            selected={selectedPlaces.some((item) => item.placeId === place.placeId)}
                            onSelect={handleSelect}
                        />
                    ))}
                </div>
            )}

            {/* Floating confirmation button */}
            {selectedPlaces.length > 0 && (
                <div className="floating-actions" style={{ animation: "slideUp 0.3s ease" }}>
                    <button
                        className="confirm-floating-btn"
                        onClick={handleConfirm}
                    >
                        Confirm Attractions ({selectedPlaces.length} selected)
                    </button>
                </div>
            )}
        </div>
    );
}

export default Places;