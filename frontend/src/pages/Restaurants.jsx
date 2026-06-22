import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";

import RestaurantCard from "../components/RestaurantCard";

import {
    getRestaurants
}
from "../services/restaurantService";

import {
    addPlacesToItinerary
}
from "../services/itineraryService";

function Restaurants() {

    const { tripId } =
    useParams();

    const [restaurants,
    setRestaurants] =
    useState([]);

    const [selectedRestaurants,
    setSelectedRestaurants] =
    useState([]);

    useEffect(() => {

        loadRestaurants();

    }, []);

    const loadRestaurants =
    async () => {

        try {

            const data =
            await getRestaurants(
                tripId
            );

            setRestaurants(
                data.restaurants
            );

        }
        catch(error){

            console.log(error);

        }
    };

    const handleSelect =
    (restaurant) => {

        const exists =
        selectedRestaurants.find(
            item =>
            item.placeId ===
            restaurant.placeId
        );

        if(exists){

            setSelectedRestaurants(

                selectedRestaurants.filter(
                    item =>
                    item.placeId !==
                    restaurant.placeId
                )

            );

        }
        else{

            setSelectedRestaurants([
                ...selectedRestaurants,
                restaurant
            ]);

        }

    };

    const handleConfirm =
    async () => {

        try{

            const itineraryItems =

            selectedRestaurants.map(
                restaurant => ({

                    type:"restaurant",

                    name:
                    restaurant.name,

                    category:
                    restaurant.category?.[0]
                    || "restaurant",

                    estimatedcost:
                    restaurant.estimatedcost

                })
            );

            await addPlacesToItinerary({

                tripId,

                items:
                itineraryItems

            });

            alert(
                "Restaurants Added"
            );

        }
        catch(error){

            console.log(error);

        }

    };

    return (

        <div>

            <h1 style={{ marginBottom: "24px" }}>Explore Restaurants</h1>

            <div className="cards-grid">
                {
                    restaurants.map(
                        restaurant => (

                        <RestaurantCard

                            key={
                            restaurant.placeId
                            }

                            restaurant={
                            restaurant
                            }

                            selected={
                            selectedRestaurants.some(
                            item =>
                            item.placeId ===
                            restaurant.placeId
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
                    Confirm Restaurants ({selectedRestaurants.length} selected)
                </button>
            </div>

        </div>

    );
}

export default Restaurants;