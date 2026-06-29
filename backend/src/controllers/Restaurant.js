import axios from "axios";
import { Trip } from "../models/CreateTrip.models.js";
import APIerror from "../utils/APIerror.js";
import { generateRestaurantDetails } from "../services/groq.service.js";

/**
 * Process an array in batches of `batchSize`, awaiting each batch before the next.
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

const getRestaurants = async (req, res) => {

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

        const restaurantResponse = await axios.get(
            "https://api.geoapify.com/v2/places",
            {
                params: {
                    categories: "catering.restaurant",
                    filter: `circle:${lon},${lat},20000`,
                    limit: 20,
                    apiKey: process.env.GEOAPIFY_API_KEY
                }
            }
        );

        const rawFeatures = restaurantResponse.data.features || [];

        // Only process restaurants that have a name
        const namedFeatures = rawFeatures.filter(
            (r) => r.properties.name && r.properties.name.trim() !== ""
        );

        // Enrich in batches of 5 to stay within Groq rate limits
        const restaurants = await batchProcess(namedFeatures, 5, async (restaurant) => {
            const name = restaurant.properties.name.trim();
            const placeId = restaurant.properties.place_id;
            const category = restaurant.properties.categories;
            const rLat = restaurant.properties.lat;
            const rLon = restaurant.properties.lon;
            const address = restaurant.properties.address_line1;

            let details = {
                description: "",
                averageCost: "",
                openingTime: "",
                closingTime: "",
                famousDishes: []
            };

            try {
                details = await generateRestaurantDetails(name);
            } catch (groqError) {
                console.error(`Groq failed for restaurant "${name}":`, groqError.message);
            }

            return {
                name,
                placeId,
                category,
                lat: rLat,
                lon: rLon,
                address,
                description: details.description || "",
                averageCost: details.averageCost || "₹300",
                estimatedcost: 300,
                openingTime: details.openingTime || "",
                closingTime: details.closingTime || "",
                famousDishes: Array.isArray(details.famousDishes) ? details.famousDishes : [],
                image: ""
            };
        });

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