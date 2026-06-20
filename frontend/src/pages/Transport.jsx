import { useState } from "react";
import { useParams } from "react-router-dom";

import {
    calculateFare
}
from "../services/transportService";

import {
    addPlacesToItinerary
}
from "../services/itineraryService";

function Transport(){

    const { tripId } =
    useParams();

    const [source,
    setSource] =
    useState("");

    const [destination,
    setDestination] =
    useState("");

    const [transporttype,
    setTransporttype] =
    useState("bus");

    const [fareData,
    setFareData] =
    useState(null);

    const handleCalculate =
    async()=>{

        try{

            const data =
            await calculateFare({

                source,

                destination,

                transporttype

            });

            setFareData(data);

        }
        catch(error){

            console.log(error);

        }

    };

    const handleAddTransport =
    async()=>{

        try{

            const items = [

                {

                    type:"transport",

                    name:
                    `${source} → ${destination}`,

                    category:
                    transporttype,

                    estimatedCost:
                    fareData.estimatedFare

                }

            ];

            await addPlacesToItinerary({

                tripId,

                items

            });

            alert(
                "Transport Added"
            );

        }
        catch(error){

            console.log(error);

        }

    };

    return(

        <div>

            <h1>
                Transport
            </h1>

            <input
                type="text"
                placeholder="Source"
                value={source}
                onChange={(e)=>
                setSource(
                    e.target.value
                )}
            />

            <br />
            <br />

            <input
                type="text"
                placeholder="Destination"
                value={destination}
                onChange={(e)=>
                setDestination(
                    e.target.value
                )}
            />

            <br />
            <br />

            <select
                value={transporttype}
                onChange={(e)=>
                setTransporttype(
                    e.target.value
                )}
            >

                <option value="bus">
                    Bus
                </option>

                <option value="train">
                    Train
                </option>

                <option value="flight">
                    Flight
                </option>

            </select>

            <br />
            <br />

            <button
                onClick={
                    handleCalculate
                }
            >
                Calculate Fare
            </button>

            {
                fareData && (

                    <div>

                        <h3>
                            Distance:
                            {
                            fareData.distance
                            } km
                        </h3>

                        <h3>
                            Fare:
                            ₹{
                            fareData.estimatedFare
                            }
                        </h3>

                        <button
                            onClick={
                            handleAddTransport
                            }
                        >
                            Add Transport
                        </button>

                    </div>

                )
            }

        </div>

    );

}

export default Transport;