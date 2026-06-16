
import axios from "axios";
import APIerror from "../utils/APIerror.js";

const getFare = async (req, res) => {

    try {

        const { source, destination , transporttype} = req.body;

        const sourceResponse = await axios.get(
            "https://api.geoapify.com/v1/geocode/search",
            {
                params: {
                    text: source,
                    apiKey: process.env.GEOAPIFY_API_KEY
                }
            }
        );

        const sourceFeature =
            sourceResponse.data.features?.[0];

        if (!sourceFeature) {
            return res.status(404).json({
                success: false,
                message: "Source not found"
            });
        }

        const sourceLat =
            sourceFeature.properties.lat;

        const sourceLon =
            sourceFeature.properties.lon;

        const destinationResponse =
            await axios.get(
                "https://api.geoapify.com/v1/geocode/search",
                {
                    params: {
                        text: destination,
                        apiKey: process.env.GEOAPIFY_API_KEY
                    }
                }
            );

        const destinationFeature =
            destinationResponse.data.features?.[0];

        if (!destinationFeature) {
            return res.status(404).json({
                success: false,
                message: "Destination not found"
            });
        }

        const destinationLat =
            destinationFeature.properties.lat;

        const destinationLon =
            destinationFeature.properties.lon;


        const routeResponse =
            await axios.get(
                "https://api.geoapify.com/v1/routing",
                {
                    params: {
                        waypoints:
`${sourceLat},${sourceLon}|${destinationLat},${destinationLon}`,

                        mode: "drive",

                        apiKey:
                        process.env.GEOAPIFY_API_KEY
                    }
                }
            );



        const feature =
            routeResponse.data.features?.[0];

        if (!feature) {
            return res.status(404).json({
                success: false,
                message: "No route found"
            });
        }

        const distanceMeters =
            feature.properties.distance;

        const distanceKm =
            distanceMeters / 1000;

        let fare = 0;

       switch (transporttype) {

    case "bus":

        fare =
        distanceKm * 2;

        break;

    case "train":

        fare =
        distanceKm * 1.5;

        break;

    case "flight":

        fare =
        (distanceKm * 6) + 500;

        break;

    default:

        return res.status(400).json({
            success:false,
            message:"Invalid transport type"
        });
}

        return res.status(200).json({
            success: true,
            source,
            destination,
            transporttype,
            distance:
                distanceKm.toFixed(2),
            estimatedFare: Math.round(fare)
        });

    }
    catch (error) {

        throw new APIerror(404,"estimated fare not calculated")

    }

};

export default getFare;