import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RestaurantCard from "../components/RestaurantCard";
import { getRestaurants } from "../services/restaurantService";
import { addPlacesToItinerary } from "../services/itineraryService";

function Restaurants() {
    const { tripId } = useParams();
    const [restaurants, setRestaurants] = useState([]);
    const [selectedRestaurants, setSelectedRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [destination, setDestination] = useState("");

    useEffect(() => {
        loadRestaurants();
    }, [tripId]);

    const loadRestaurants = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await getRestaurants(tripId);
            setRestaurants(data.restaurants || []);
            // Attempt to get destination info if available
            if (data.destination) {
                setDestination(data.destination);
            } else if (data.restaurants?.[0]?.address) {
                // Infer destination from restaurant addresses if needed
                const parts = data.restaurants[0].address.split(",");
                if (parts.length > 2) {
                    setDestination(parts[parts.length - 2].trim());
                }
            }
        } catch (err) {
            console.error(err);
            setError(err?.response?.data?.message || "Failed to load restaurants. Please check your connection and try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (restaurant) => {
        const exists = selectedRestaurants.find((item) => item.placeId === restaurant.placeId);
        if (exists) {
            setSelectedRestaurants(selectedRestaurants.filter((item) => item.placeId !== restaurant.placeId));
        } else {
            setSelectedRestaurants([...selectedRestaurants, restaurant]);
        }
    };

    const handleConfirm = async () => {
        if (selectedRestaurants.length === 0) return;
        try {
            const itineraryItems = selectedRestaurants.map((r) => ({
                tripId,
                type: "restaurant",
                name: r.name,
                category: r.category || "restaurant",
                estimatedCost: r.estimatedcost || 300,
            }));

            await addPlacesToItinerary({
                tripId,
                items: itineraryItems,
            });

            alert("Restaurants successfully added to your itinerary!");
            setSelectedRestaurants([]); // Reset selection on success
        } catch (err) {
            console.error(err);
            alert("Failed to add selected restaurants to itinerary. Please try again.");
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
                    background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    marginBottom: "8px",
                    letterSpacing: "-0.02em",
                }}>
                    🍔 Explore Restaurants {destination ? `in ${destination}` : ""}
                </h1>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", margin: 0 }}>
                    Find top-rated dining spots, local food hubs, and must-try dishes.
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
                        border: "4px solid rgba(245,158,11,0.15)",
                        borderTopColor: "#f59e0b",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                    }} />
                    <p style={{
                        color: "var(--text-secondary)",
                        fontFamily: "'Outfit', sans-serif",
                        fontWeight: 500
                    }}>
                        Searching Foursquare Dining &amp; fetching expert recommendations...
                    </p>
                </div>
            ) : restaurants.length === 0 ? (
                <div style={{
                    textAlign: "center",
                    padding: "60px 20px",
                    background: "rgba(18,30,51,0.3)",
                    borderRadius: "20px",
                    border: "1px solid rgba(255,255,255,0.05)"
                }}>
                    <span style={{ fontSize: "2.5rem" }}>🍽️</span>
                    <h3 style={{ marginTop: "16px", color: "var(--text-primary)" }}>No restaurants found</h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", maxWidth: "400px", margin: "8px auto 0" }}>
                        We couldn't find any dining options for "{destination || "this city"}". Try updating the trip destination or checking spelling.
                    </p>
                </div>
            ) : (
                <div className="cards-grid">
                    {restaurants.map((restaurant) => (
                        <RestaurantCard
                            key={restaurant.placeId}
                            restaurant={restaurant}
                            selected={selectedRestaurants.some((item) => item.placeId === restaurant.placeId)}
                            onSelect={handleSelect}
                        />
                    ))}
                </div>
            )}

            {/* Floating confirmation button */}
            {selectedPlacesLength => null /* Placeholder matching style structure */}
            {selectedRestaurants.length > 0 && (
                <div className="floating-actions" style={{ animation: "slideUp 0.3s ease" }}>
                    <button
                        className="confirm-floating-btn"
                        onClick={handleConfirm}
                        style={{
                            background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                            boxShadow: "0 0 24px rgba(245,158,11,0.3)"
                        }}
                    >
                        Confirm Restaurants ({selectedRestaurants.length} selected)
                    </button>
                </div>
            )}
        </div>
    );
}

export default Restaurants;