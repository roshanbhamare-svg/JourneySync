

import axios from "axios";
import { Trip } from "../models/CreateTrip.models.js";
import APIerror from "../utils/APIerror.js";

 const getPlaces = async (req, res) => {
    try {

        const { tripId } = req.params;

        const trip = await Trip.findById(tripId);

        if (!trip) {
        throw new APIerror(404 , "trip not found");
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
        throw new APIerror(404 , "destination not found");
        }

        const lat =
            feature.properties.lat;

        const lon =
            feature.properties.lon;


        const placesResponse =
            await axios.get(
                "https://api.geoapify.com/v2/places",
                {
                    params: {
                        categories:
                            "tourism.sights,tourism.attraction",

                        filter:
                            `circle:${lon},${lat},10000`,

                        limit: 20,

                        apiKey:
                            process.env.GEOAPIFY_API_KEY
                    }
                }
            );

        return res.status(200).json({
            success: true,
            destination,
            places:
                placesResponse.data.features
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

export default getPlaces;