import { Link } from "react-router-dom";

function Navbar() {

    const tripId =
    localStorage.getItem(
        "currentTripId"
    );

    return (

        <div
            style={{
                padding: "10px",
                borderBottom:
                "1px solid black",
                marginBottom:
                "20px"
            }}
        >

            <Link to="/dashboard">
                Dashboard
            </Link>

            {
                tripId && (
                    <>
                        {" | "}

                        <Link
                        to={`/trip/${tripId}/places`}
                        >
                            Places
                        </Link>

                        {" | "}

                        <Link
                        to={`/trip/${tripId}/restaurants`}
                        >
                            Restaurants
                        </Link>

                        {" | "}

                        <Link
                        to={`/trip/${tripId}/transport`}
                        >
                            Transport
                        </Link>

                        {" | "}

                        <Link
                        to={`/trip/${tripId}/preitinerary`}
                        >
                            Pre Itinerary
                        </Link>

                        {" | "}

                        <Link
                        to={`/trip/${tripId}/finalitinerary`}
                        >
                            Final Itinerary
                        </Link>

                        {" | "}

                        <Link
                        to={`/trip/${tripId}/budget`}
                        >
                            Budget Tracker
                        </Link>

                        {" | "}

                        <Link
                        to={`/trip/${tripId}/expense`}
                        >
                            Expense Tracker
                        </Link>

                        {" | "}

                        <Link
                        to={`/trip/${tripId}/checklist`}
                        >
                            Checklist
                        </Link>
                    </>
                )
            }

        </div>

    );

}

export default Navbar;