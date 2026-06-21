import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";

import {
    getItineraryStatus
}
from "../services/itineraryService";

function ItineraryGuard({ children }) {

    const { tripId } =
    useParams();

    const [loading,
    setLoading] =
    useState(true);

    const [confirmed,
    setConfirmed] =
    useState(false);

    useEffect(() => {

        checkStatus();

    }, []);

    const checkStatus =
    async () => {

        try {

            const data =
            await getItineraryStatus(
                tripId
            );

            setConfirmed(
                data.confirmed
            );

        }
        catch(error){

            console.log(error);

        }
        finally{

            setLoading(false);

        }

    };

    if(loading){

        return(
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
                <h2>Loading status...</h2>
            </div>
        );

    }

    if(!confirmed){

        return(

            <div className="fallback-screen glass-panel">

                <h1>
                    Itinerary Not Confirmed
                </h1>

                <p>
                    Please complete and confirm your itinerary first.
                </p>

                <a 
                    href={`/trip/${tripId}/preitinerary`} 
                    className="btn btn-primary"
                    style={{ textDecoration: "none" }}
                >
                    Go to Pre Itinerary
                </a>

            </div>

        );

    }

    return children;

}

export default ItineraryGuard;