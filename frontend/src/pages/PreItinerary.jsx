import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import {
getTripItinerary,
confirmItinerary
}
from "../services/itineraryService";

function PreItinerary() {


const { tripId } =
useParams();

const navigate =
useNavigate();

const [items,
setItems] =
useState([]);

useEffect(() => {

    loadItinerary();

}, []);

const loadItinerary =
async () => {

    try {

        const data =
        await getTripItinerary(
            tripId
        );

        setItems(
            data.data
        );

    }
    catch(error){

        console.log(error);

    }

};

const handleDayChange =
(id,value)=>{

    setItems(

        items.map(item=>

            item._id===id

            ? {
                ...item,
                day:Number(value)
              }

            : item

        )

    );

};

const handleOrderChange =
(id,value)=>{

    setItems(

        items.map(item=>

            item._id===id

            ? {
                ...item,
                order:Number(value)
              }

            : item

        )

    );

};

const handleConfirm =
async()=>{

    try{

        await confirmItinerary(

            tripId,

            {
                items
            }

        );

        alert(
            "Itinerary Confirmed Successfully"
        );

        navigate(
            `/trip/${tripId}/finalitinerary`
        );

    }
    catch(error){

        console.log(error);

    }

};

return(

    <div style={{ position: "relative" }}>

        <h1 style={{ marginBottom: "8px" }}>Pre Itinerary Planner</h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: "24px" }}>
            Assign travel days and visitation sequences to your selected attractions, dining options, and transportation entries.
        </p>

        <div className="pre-itinerary-container" style={{ marginBottom: "80px" }}>
            {
                items.map(item=>(

                    <div key={item._id} className="pre-itinerary-item">

                        <div className="pre-itinerary-info">
                            <h3 style={{ fontSize: "1.15rem", fontWeight: "600" }}>{item.name}</h3>
                            <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                                <span className={`timeline-badge ${item.type}`}>
                                    {item.type}
                                </span>
                                {item.estimatedCost > 0 && (
                                    <span style={{ color: "var(--success)", fontSize: "0.85rem", fontWeight: "600" }}>
                                        ₹{item.estimatedCost}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="pre-itinerary-inputs">
                            <div className="pre-itinerary-input-group">
                                <span>Day</span>
                                <input
                                    type="number"
                                    min="1"
                                    placeholder="Day"
                                    value={item.day || ""}
                                    onChange={(e)=> handleDayChange(item._id, e.target.value)}
                                />
                            </div>

                            <div className="pre-itinerary-input-group">
                                <span>Order</span>
                                <input
                                    type="number"
                                    min="1"
                                    placeholder="Seq"
                                    value={item.order || ""}
                                    onChange={(e)=> handleOrderChange(item._id, e.target.value)}
                                />
                            </div>
                        </div>

                    </div>

                ))
            }
        </div>

        <div className="floating-actions">
            <button
                className="confirm-floating-btn"
                onClick={handleConfirm}
            >
                Confirm Itinerary
            </button>
        </div>

    </div>

);


}

export default PreItinerary;
