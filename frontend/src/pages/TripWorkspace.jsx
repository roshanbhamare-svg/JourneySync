import { useParams }
from "react-router-dom";

import { Link }
from "react-router-dom";

function TripWorkspace() {

    const { tripId } =
    useParams();

    return (

        <div>

            <h1>
                Trip Workspace
            </h1>

            <Link
                to={`/trip/${tripId}/places`}
            >
                Places
            </Link>

        </div>
    );
}

export default TripWorkspace;