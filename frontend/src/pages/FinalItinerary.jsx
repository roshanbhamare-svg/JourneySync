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

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
                <h1 style={{ margin: 0 }}>Final Itinerary</h1>
                <div style={{ display: "flex", gap: "12px" }}>
                    <Link to={`/trip/${tripId}/budget`} className="btn navbar-link active" style={{ fontSize: "0.85rem" }}>
                        📊 Budget
                    </Link>
                    <Link to={`/trip/${tripId}/expense`} className="btn navbar-link active" style={{ fontSize: "0.85rem" }}>
                        💸 Expenses
                    </Link>
                    <Link to={`/trip/${tripId}/checklist`} className="btn navbar-link active" style={{ fontSize: "0.85rem" }}>
                        ✓ Checklist
                    </Link>
                </div>
            </div>

            <div className="timeline-section">
                {
                    Object.keys(groupedDays).sort((a, b) => Number(a) - Number(b)).map(day => (
                        <div key={day} style={{ marginBottom: "32px" }}>
                            <h2 className="timeline-day-header">
                                Day {day}
                            </h2>

                            <div className="timeline-cards">
                                {
                                    groupedDays[day]
                                        .sort((a, b) => (a.order || 0) - (b.order || 0))
                                        .map(item => (
                                            <div key={item._id} className="timeline-card">
                                                <div className="timeline-card-header">
                                                    <h3 className="timeline-card-title">{item.name}</h3>
                                                    <span className={`timeline-badge ${item.type}`}>
                                                        {item.type}
                                                    </span>
                                                </div>

                                                <div className="timeline-card-meta">
                                                    <span><strong>Seq:</strong> #{item.order || "-"}</span>
                                                    {item.estimatedCost > 0 && (
                                                        <span style={{ color: "var(--success)" }}>
                                                            <strong>Cost:</strong> ₹{item.estimatedCost}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                }
                            </div>
                        </div>
                    ))
                }
            </div>

        </div>
</ItineraryGuard>

);


}

export default FinalItinerary;
