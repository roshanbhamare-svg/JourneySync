import axios from "axios";
import { Trip } from "../models/CreateTrip.models.js";
import APIerror from "../utils/APIerror.js";

const getRestaurants = async (req, res) => {

    try {

        const { tripId } = req.params;

        const trip = await Trip.findById(tripId);

        if (!trip) {
            throw new APIerror(404, "Trip not found");
        }

        const destination = trip.destination;

        const geoResponse = await axios.get(
            "https://api.geoapify.com/v1/geocode/search",
            {
                params: {
                    text: destination,
                    apiKey: process.env.GEOAPIFY_API_KEY
                }
            }
        );

        const feature =
            geoResponse.data.features?.[0];

        if (!feature) {
            throw new APIerror(404, "Destination not found");
        }

        const lat = feature.properties.lat;
        const lon = feature.properties.lon;

        const restaurantResponse =
            await axios.get(
                "https://api.geoapify.com/v2/places",
                {
                    params: {

                        categories:
                            "catering.restaurant",

                        filter:
                            `circle:${lon},${lat},20000`,

                        limit: 20,

                        apiKey:
                            process.env.GEOAPIFY_API_KEY
                    }
                }
            );

        const restaurants =
            restaurantResponse.data.features.map(
                (restaurant) => ({
                    name:
                        restaurant.properties.name,

                    placeId:
                        restaurant.properties.place_id,

                    category:
                        restaurant.properties.categories,

                    lat:
                        restaurant.properties.lat,

                    lon:
                        restaurant.properties.lon,

                    address:
                        restaurant.properties.address_line1
                })
            );

        return res.status(200).json({
            success: true,
            restaurants
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

export default getRestaurants;