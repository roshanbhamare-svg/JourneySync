
import axios from "axios";

const getFare = async (req, res) => {

    try {

        const { source, destination } = req.body;

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


        console.log(
            JSON.stringify(
                routeResponse.data,
                null,
                2
            )
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

        const estimatedFare =
            Math.round(
                distanceKm * 12
            );

        return res.status(200).json({
            success: true,
            source,
            destination,
            distance:
                distanceKm.toFixed(2),
            estimatedFare
        });

    }
    catch (error) {

        console.log(error.response?.data);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

export default getFare;