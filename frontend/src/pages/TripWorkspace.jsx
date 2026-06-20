import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

function TripWorkspace() {

    const { tripId } =
    useParams();

    return (

        <div>

            <h1>
                Trip Workspace
            </h1>

            <br />

            <Link
                to={`/trip/${tripId}/places`}
            >
                Places
            </Link>

            <br />
            <br />

            <Link
                to={`/trip/${tripId}/restaurants`}
            >
                Restaurants
            </Link>

            <br />
            <br />

            <Link
                to={`/trip/${tripId}/transport`}
            >
                Transport
            </Link>

            <br />
            <br />

            <Link
                to={`/trip/${tripId}/preitinerary`}
            >
                Pre Itinerary
            </Link>

            <br />
            <br />

            <Link
                to={`/trip/${tripId}/final-itinerary`}
            >
                Final Itinerary
            </Link>

            <br />
            <br />

            <Link
                to={`/trip/${tripId}/budget`}
            >
                Budget Tracker
            </Link>

            <br />
            <br />

            <Link
                to={`/trip/${tripId}/expense`}
            >
                Expense Tracker
            </Link>

            <br />
            <br />

            <Link
                to={`/trip/${tripId}/checklist`}
            >
                Checklist
            </Link>

        </div>

    );

}

export default TripWorkspace;