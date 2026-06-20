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
            <h2>
                Loading...
            </h2>
        );

    }

    if(!confirmed){

        return(

            <div>

                <h1>
                    Itinerary Not Confirmed
                </h1>

                <p>
                    Please complete and
                    confirm your itinerary
                    first.
                </p>

            </div>

        );

    }

    return children;

}

export default ItineraryGuard;