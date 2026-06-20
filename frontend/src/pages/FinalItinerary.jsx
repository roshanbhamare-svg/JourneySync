import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

import {getFinalItinerary} from "../services/itineraryService";

import ItineraryGuard from "../components/ItineraryGuard";

function FinalItinerary() {


const { tripId } =
useParams();

const [itinerary,
setItinerary] =
useState([]);

useEffect(() => {

    loadItinerary();

}, []);

const loadItinerary =
async () => {

    try {

        const data =
        await getFinalItinerary(
            tripId
        );

        setItinerary(
            data.itinerary
        );

    }
    catch(error){

        console.log(error);

    }

};

const groupedDays =
itinerary.reduce(

    (acc,item)=>{

        if(
            !acc[item.day]
        ){

            acc[item.day] = [];

        }

        acc[item.day].push(
            item
        );

        return acc;

    },

    {}

);

return (

<ItineraryGuard>
        <div>

        <h1>
            Final Itinerary
        </h1>

        {

            Object.keys(
                groupedDays
            ).map(day=>(

                <div
                key={day}
                >

                    <h2>
                        Day {day}
                    </h2>

                    {

                        groupedDays[day]
                        .map(item=>(

                            <div
                            key={
                                item._id
                            }
                            style={{
                                border:
                                "1px solid black",

                                padding:
                                "10px",

                                margin:
                                "10px"
                            }}
                            >

                                <h3>
                                    {
                                        item.name
                                    }
                                </h3>

                                <p>
                                    Type :
                                    {
                                        item.type
                                    }
                                </p>

                                <p>
                                    Order :
                                    {
                                        item.order
                                    }
                                </p>

                                <p>
                                    Cost :
                                    ₹{
                                        item.estimatedCost
                                    }
                                </p>

                            </div>

                        ))

                    }

                </div>

            ))

        }

        <hr />



         <Link
        to={`/trip/${tripId}/budget`}
        >
            Budget Tracker
        </Link>

        <br />

        <Link
        to={`/trip/${tripId}/expense`}
        >
            Expense Tracker
        </Link>

        <br />

        <Link
        to={`/trip/${tripId}/checklist`}
        >
            Checklist
        </Link>


    </div>
</ItineraryGuard>

);


}

export default FinalItinerary;
