
import axios from "axios";

const getFare = async (req, res) => {

    try {

        const { source, destination } = req.body;

        if (!source || !destination) {
            return res.status(400).json({
                success: false,
                message: "Source and destination required"
            });
        }

        // SOURCE COORDINATES

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

        // DESTINATION COORDINATES

        const destinationResponse =
            await axios.get(
                "https://api.geoapify.com/v1/geocode/search",
                {
                    params: {
                        text: destination,
                        apiKey:
                            process.env.GEOAPIFY_API_KEY
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

        // HAVERSINE DISTANCE

        const toRad = (value) =>
            value * Math.PI / 180;

        const R = 6371;

        const dLat =
            toRad(destinationLat - sourceLat);

        const dLon =
            toRad(destinationLon - sourceLon);

        const a =
            Math.sin(dLat / 2) *
            Math.sin(dLat / 2) +
            Math.cos(toRad(sourceLat)) *
            Math.cos(toRad(destinationLat)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);

        const c =
            2 * Math.atan2(
                Math.sqrt(a),
                Math.sqrt(1 - a)
            );

        const distanceKm = R * c;

        // CUSTOM FARE

        const farePerKm = 12;

        const estimatedFare =
            Math.round(
                distanceKm * farePerKm
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

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

export default getFare;