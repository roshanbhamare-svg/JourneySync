import axios from "axios";
import { Trip } from "../models/CreateTrip.models.js";
import APIerror from "../utils/APIerror.js";
import { generatePlaceDetails } from "../services/groq.service.js";

/**
 * Process an array in batches of `batchSize`, awaiting each batch before the next.
 * This avoids hammering the Groq API with 20 simultaneous calls.
 */
const batchProcess = async (items, batchSize, asyncFn) => {
    const results = [];
    for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);
        const batchResults = await Promise.all(batch.map(asyncFn));
        results.push(...batchResults);
    }
    return results;
};

const getPlaces = async (req, res) => {
    try {
        const { tripId } = req.params;

        const trip = await Trip.findById(tripId);

        if (!trip) {
            return res.status(404).json({ success: false, message: "Trip not found" });
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

        const feature = geoResponse.data.features?.[0];

        if (!feature) {
            return res.status(404).json({ success: false, message: "Destination not found" });
        }

        const lat = feature.properties.lat;
        const lon = feature.properties.lon;

        const placesResponse = await axios.get(
            "https://api.geoapify.com/v2/places",
            {
                params: {
                    categories: "tourism.sights,tourism.attraction",
                    filter: `circle:${lon},${lat},10000`,
                    limit: 20,
                    apiKey: process.env.GEOAPIFY_API_KEY
                }
            }
        );

        const rawFeatures = placesResponse.data.features || [];

        // Only process places that have a name
        const namedFeatures = rawFeatures.filter(
            (place) => place.properties.name && place.properties.name.trim() !== ""
        );

        // Enrich in batches of 5 to stay within Groq rate limits
        const places = await batchProcess(namedFeatures, 5, async (place) => {
            const name = place.properties.name.trim();
            const placeId = place.properties.place_id;
            const category = place.properties.categories;
            const placeLat = place.properties.lat;
            const placeLon = place.properties.lon;
            const address = place.properties.address_line1;

            let details = {
                description: "",
                estimatedFare: "",
                openingTime: "",
                closingTime: ""
            };

            try {
                details = await generatePlaceDetails(name);
            } catch (groqError) {
                console.error(`Groq failed for place "${name}":`, groqError.message);
            }

            return {
                name,
                placeId,
                category,
                lat: placeLat,
                lon: placeLon,
                latitude: placeLat,
                longitude: placeLon,
                address,
                estimatedCost: 100,
                description: details.description || "",
                estimatedFare: details.estimatedFare || "₹100",
                openingTime: details.openingTime || "",
                closingTime: details.closingTime || "",
                image: ""
            };
        });

        return res.status(200).json({
            success: true,
            destination,
            places
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export default getPlaces;