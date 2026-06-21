import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";

import PlaceCard from "../components/PlaceCard";

import {
    getPlaces
}
from "../services/placesService";

import {
    addPlacesToItinerary
}
from "../services/itineraryService";

function Places() {

    const { tripId } =
    useParams();

    const [places,
    setPlaces] =
    useState([]);

    const [selectedPlaces,
    setSelectedPlaces] =
    useState([]);

    useEffect(() => {

        loadPlaces();

    }, []);

    const loadPlaces =
    async () => {

        try {

            const data =
            await getPlaces(tripId);

            setPlaces(data.places);

        }
        catch(error){

            console.log(error);

        }
    };

    const handleSelect =
    (place) => {

        const exists =
        selectedPlaces.find(
            item =>
            item.placeId ===
            place.placeId
        );

        if(exists){

            setSelectedPlaces(

                selectedPlaces.filter(
                    item =>
                    item.placeId !==
                    place.placeId
                )

            );

        }
        else{

            setSelectedPlaces([

                ...selectedPlaces,

                place

            ]);

        }

    };

    const handleConfirm =
    async () => {

        try{

            const itineraryItems =

            selectedPlaces.map(
                place => ({

                    tripId,

                    type:
                    "place",

                    name:
                    place.name,

                    category:
                    place.category?.[0]
                    || "place",

                    estimatedCost:
                    place.estimatedCost

                })
            );

            await addPlacesToItinerary({
                tripId,
                items:
                itineraryItems

            });

            alert(
                "Places Added Successfully"
            );

        }
        catch(error){

            console.log(error);

        }

    };

    return (

        <div>

            <h1 style={{ marginBottom: "24px" }}>Explore Places</h1>

            <div className="cards-grid">
                {
                    places.map(
                        (place) => (

                        <PlaceCard

                            key={
                                place.placeId
                            }

                            place={
                                place
                            }

                            selected={
                                selectedPlaces.some(
                                    item =>
                                    item.placeId ===
                                    place.placeId
                                )
                            }

                            onSelect={
                                handleSelect
                            }

                        />

                        )
                    )
                }
            </div>

            <div className="floating-actions">
                <button
                    className="confirm-floating-btn"
                    onClick={
                        handleConfirm
                    }
                >
                    Confirm Places ({selectedPlaces.length} selected)
                </button>
            </div>

        </div>

    );
}

export default Places;