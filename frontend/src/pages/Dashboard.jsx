import { useState } from "react";
import { useEffect } from "react";

import { useNavigate }
from "react-router-dom";

import {
    createTrip,
    getAllTrips,
    deleteTrip
}
from "../services/tripService";

import TripCard
from "../components/TripCard";

function Dashboard() {

    const navigate =
    useNavigate();

    const [trips,
    setTrips] =
    useState([]);

    const [selectedTrip,
    setSelectedTrip] =
    useState(
        localStorage.getItem(
            "currentTripId"
        ) || ""
    );

    const [formData,
    setFormData] =
    useState({

        source: "",

        destination: "",

        days: "",

        people: "",

        totalBudget: ""

    });

    const [loadingTrips, setLoadingTrips] = useState(true);
    const [creatingTrip, setCreatingTrip] = useState(false);

    const fetchTrips =
    async () => {
        setLoadingTrips(true);
        try {

            const response =
            await getAllTrips();

            setTrips(
                response.data.data
            );

        }
        catch (error) {

            console.log(error);

        } finally {
            setLoadingTrips(false);
        }

    };

    useEffect(() => {

        fetchTrips();

    }, []);

    const handleChange =
    (e) => {

        setFormData({

            ...formData,

            [e.target.name]:
            e.target.value

        });

    };

    const handleCreateTrip =
    async (e) => {

        e.preventDefault();
        setCreatingTrip(true);

        try {

            await createTrip(
                formData
            );

            alert(
                "Trip Created"
            );

            setFormData({

                source: "",

                destination: "",

                days: "",

                people: "",

                totalBudget: ""

            });

            fetchTrips();

        }
        catch (error) {

            console.log(error);

        } finally {
            setCreatingTrip(false);
        }

    };

    const handleDelete =
    async (tripId) => {

        try {

            await deleteTrip(
                tripId
            );

            fetchTrips();

        }
        catch (error) {

            console.log(error);

        }

    };

    const handleOpen =
    (tripId) => {

        localStorage.setItem(
            "currentTripId",
            tripId
        );

        setSelectedTrip(
            tripId
        );

        navigate(
            `/trip/${tripId}/places`
        );

    };

return (

        <div>

            <div className="dashboard-header">
                <h1>Trip Dashboard</h1>
                {
                    selectedTrip && (
                        <div className="selected-trip-badge">
                            Selected Trip ID: {selectedTrip}
                        </div>
                    )
                }
            </div>

            <div className="create-trip-section">
                <div className="create-trip-card">
                    <h3 className="create-trip-title">Plan a New Adventure</h3>
                    {creatingTrip ? (
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "40px",
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
                                Crafting your perfect itinerary...
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleCreateTrip}>
                        <div className="form-row">
                            <input
                                type="text"
                                name="source"
                                placeholder="Source (e.g. Mumbai)"
                                value={formData.source}
                                onChange={handleChange}
                                required
                            />

                            <input
                                type="text"
                                name="destination"
                                placeholder="Destination (e.g. Goa)"
                                value={formData.destination}
                                onChange={handleChange}
                                required
                            />

                            <input
                                type="number"
                                name="days"
                                placeholder="Days"
                                value={formData.days}
                                onChange={handleChange}
                                required
                            />

                            <input
                                type="number"
                                name="people"
                                placeholder="People"
                                value={formData.people}
                                onChange={handleChange}
                                required
                            />

                            <input
                                type="number"
                                name="totalBudget"
                                placeholder="Budget (₹)"
                                value={formData.totalBudget}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button type="submit" className="btn-primary" style={{ alignSelf: "flex-end", marginTop: "8px" }}>
                            Create Trip
                        </button>
                    </form>
                    )}
                </div>
            </div>

            <h2 className="trips-section-title">
                My Trips
            </h2>

            <div className="trips-grid">
                {loadingTrips ? (
                    <div style={{
                        gridColumn: "1 / -1",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "40px",
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
                            Loading your trips...
                        </p>
                    </div>
                ) : trips.length > 0 ? (
                    trips.map((trip) => (
                        <TripCard
                            key={trip._id}
                            trip={trip}
                            onDelete={handleDelete}
                            onOpen={handleOpen}
                        />
                    ))
                ) : (
                    <div style={{
                        gridColumn: "1 / -1",
                        textAlign: "center",
                        padding: "40px",
                        color: "var(--text-secondary)"
                    }}>
                        You have not created any trips yet.
                    </div>
                )}
            </div>

        </div>

    );

}

export default Dashboard;