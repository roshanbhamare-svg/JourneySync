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

    const fetchTrips =
    async () => {

        try {

            const response =
            await getAllTrips();

            setTrips(
                response.data.data
            );

        }
        catch (error) {

            console.log(error);

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
                </div>
            </div>

            <h2 className="trips-section-title">
                My Trips
            </h2>

            <div className="trips-grid">
                {
                    trips.map((trip) => (
                        <TripCard
                            key={trip._id}
                            trip={trip}
                            onDelete={handleDelete}
                            onOpen={handleOpen}
                        />
                    ))
                }
            </div>

        </div>

    );

}

export default Dashboard;