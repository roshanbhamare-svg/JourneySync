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

            <h1>
                Trip Dashboard
            </h1>

            <hr />

            {
                selectedTrip &&
                (
                    <h3>
                        Selected Trip :
                        {" "}
                        {selectedTrip}
                    </h3>
                )
            }

            <hr />

            <form
            onSubmit={
                handleCreateTrip
            }
            >

                <input
                    type="text"
                    name="source"
                    placeholder="Source"
                    value={formData.source}
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="destination"
                    placeholder="Destination"
                    value={formData.destination}
                    onChange={handleChange}
                />

                <input
                    type="number"
                    name="days"
                    placeholder="Days"
                    value={formData.days}
                    onChange={handleChange}
                />

                <input
                    type="number"
                    name="people"
                    placeholder="People"
                    value={formData.people}
                    onChange={handleChange}
                />

                <input
                    type="number"
                    name="totalBudget"
                    placeholder="Budget"
                    value={formData.totalBudget}
                    onChange={handleChange}
                />

                <button
                type="submit"
                >
                    Create Trip
                </button>

            </form>

            <hr />

            <h2>
                My Trips
            </h2>

            {

                trips.map(
                    (trip) => (

                    <TripCard

                        key={trip._id}

                        trip={trip}

                        onDelete={
                            handleDelete
                        }

                        onOpen={
                            handleOpen
                        }

                    />

                ))

            }

        </div>

    );

}

export default Dashboard;