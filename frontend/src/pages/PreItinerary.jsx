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
            `/trip/${tripId}/final-itinerary`
        );

    }
    catch(error){

        console.log(error);

    }

};

return(

    <div>

        <h1>
            Pre Itinerary
        </h1>

        {

            items.map(item=>(

                <div
                    key={item._id}
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
                        {item.name}
                    </h3>

                    <p>
                        Type :
                        {item.type}
                    </p>

                    <input
                        type="number"
                        placeholder="Day"
                        value={
                            item.day || ""
                        }
                        onChange={(e)=>

                            handleDayChange(
                                item._id,
                                e.target.value
                            )

                        }
                    />

                    <input
                        type="number"
                        placeholder="Order"
                        value={
                            item.order || ""
                        }
                        onChange={(e)=>

                            handleOrderChange(
                                item._id,
                                e.target.value
                            )

                        }
                    />

                </div>

            ))

        }

        <button
            onClick={
                handleConfirm
            }
        >
            Confirm Itinerary
        </button>

    </div>

);


}

export default PreItinerary;
