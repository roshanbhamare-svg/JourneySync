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

            <h1 style={{ marginBottom: "24px" }}>Calculate Transport Fare</h1>

            <div className="glass-panel" style={{ maxWidth: "500px", margin: "0 auto" }}>
                <form onSubmit={(e) => { e.preventDefault(); handleCalculate(); }}>
                    <div className="form-group">
                        <label>Source</label>
                        <input
                            type="text"
                            placeholder="Departure City"
                            value={source}
                            onChange={(e)=> setSource(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Destination</label>
                        <input
                            type="text"
                            placeholder="Arrival City"
                            value={destination}
                            onChange={(e)=> setDestination(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Transport Mode</label>
                        <select
                            value={transporttype}
                            onChange={(e)=> setTransporttype(e.target.value)}
                        >
                            <option value="bus">🚌 Bus</option>
                            <option value="train">🚂 Train</option>
                            <option value="flight">✈️ Flight</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        style={{ marginTop: "10px" }}
                    >
                        Calculate Fare
                    </button>
                </form>

                {
                    fareData && (

                        <div className="glass-card" style={{ marginTop: "24px", borderLeft: "4px solid var(--primary)", background: "rgba(255,255,255,0.01)" }}>

                            <h3 style={{ fontSize: "1.1rem", marginBottom: "8px" }}>Fare Details</h3>
                            <p style={{ color: "var(--text-secondary)", marginBottom: "4px" }}>
                                <strong>Distance:</strong> {fareData.distance} km
                            </p>

                            <p style={{ color: "var(--text-secondary)", marginBottom: "16px" }}>
                                <strong>Estimated Fare:</strong> <span style={{ color: "var(--success)", fontWeight: "700", fontSize: "1.2rem" }}>₹{fareData.estimatedFare}</span>
                            </p>

                            <button
                                className="btn-primary"
                                onClick={handleAddTransport}
                                style={{ width: "100%" }}
                            >
                                Add Transport to Itinerary
                            </button>

                        </div>

                    )
                }
            </div>

        </div>

    );

}

export default Transport;