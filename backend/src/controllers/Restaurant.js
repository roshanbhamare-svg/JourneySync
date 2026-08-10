import { Trip } from "../models/CreateTrip.models.js";
import {
    searchRestaurants,
    extractPhotoUrl,
    buildAddress,
    getPrimaryCategory,
    parseHours,
} from "../services/foursquare.service.js";
import { generateRestaurantDetails, generateRestaurantsFallback } from "../services/groq.service.js";

/**
 * Process an array in batches to avoid hammering the Groq API.
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

        // ── Step 1: Fetch restaurants from Foursquare ─────────────────────────
        let rawRestaurants = [];
        try {
            rawRestaurants = await searchRestaurants(destination, 20);
        } catch (fsqErr) {
            console.warn("[Restaurants] Foursquare fetch failed, falling back to Groq:", fsqErr.message);
        }

        // Only keep named entries
        const namedRestaurants = rawRestaurants.filter(
            (r) => r.name && r.name.trim() !== ""
        );

        let restaurants = [];

        if (namedRestaurants.length > 0) {
            // ── Step 2: Enrich with Groq for missing fields (batches of 5) ─────────
            restaurants = await batchProcess(namedRestaurants, 5, async (restaurant) => {
                const photo = extractPhotoUrl(restaurant.photos);

                const name = restaurant.name.trim();
                const category = getPrimaryCategory(restaurant.categories);
                const rating = restaurant.rating
                    ? parseFloat((restaurant.rating / 2).toFixed(1))
                    : null;
                const reviewCount = null;
                const address = buildAddress(restaurant.location);
                const { openingHours, closingHours } = parseHours(restaurant.hours);
                const website = restaurant.website || "";
                const country = restaurant.location?.country || "India";

                let aiDetails = {
                    description: "",
                    averageCostForTwo: "",
                    mustTryDishes: "",
                    travelTips: "",
                };

                try {
                    aiDetails = await generateRestaurantDetails({ name, city: destination, country });
                } catch (groqErr) {
                    console.error(`[Groq] Failed for restaurant "${name}":`, groqErr.message);
                }

                return {
                    placeId: restaurant.fsq_place_id || `rest_${Math.random().toString(36).substr(2, 9)}`,
                    name,
                    category,
                    rating,
                    reviewCount,
                    address,
                    openingHours,
                    closingHours,
                    website,
                    photo,
                    description: aiDetails.description,
                    averageCostForTwo: aiDetails.averageCostForTwo,
                    mustTryDishes: aiDetails.mustTryDishes,
                    travelTips: aiDetails.travelTips,
                    estimatedcost: 300,
                    estimatedCost: 300,
                };
            });
        }

        // Fallback to Groq if 0 results
        if (restaurants.length === 0) {
            console.log(`[Restaurants] Using Groq AI fallback generation for destination "${destination}"`);
            restaurants = await generateRestaurantsFallback(destination);
        }

        return res.status(200).json({
            success: true,
            destination,
            restaurants,
        });
    } catch (error) {
        console.error("[Restaurants] Error:", error.message);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch restaurants. Please try again.",
        });
    }
};

export default getRestaurants;