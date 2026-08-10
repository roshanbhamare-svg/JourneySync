import { Trip } from "../models/CreateTrip.models.js";
import {
    searchPlaces,
    extractPhotoUrl,
    buildAddress,
    getPrimaryCategory,
    parseHours,
} from "../services/foursquare.service.js";
import { generatePlaceDetails, generatePlacesFallback } from "../services/groq.service.js";

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

/**
 * Keywords in category names that indicate utility/non-tourist places to skip.
 */
const UTILITY_KEYWORDS = [
    "toilet", "restroom", "parking", "bus stop", "gate", "counter",
    "ticket", "office", "donation", "atm", "bank", "post", "hospital",
    "clinic", "pharmacy", "laundry", "shop", "store", "supermarket",
];

const isUtility = (categoryName = "") => {
    const lower = categoryName.toLowerCase();
    return UTILITY_KEYWORDS.some((kw) => lower.includes(kw));
};

const getPlaces = async (req, res) => {
    try {
        const { tripId } = req.params;

        const trip = await Trip.findById(tripId);
        if (!trip) {
            return res.status(404).json({ success: false, message: "Trip not found" });
        }

        const destination = trip.destination;

        // ── Step 1: Fetch tourist attractions from Foursquare ─────────────────
        let rawPlaces = [];
        try {
            rawPlaces = await searchPlaces(destination, 25);
        } catch (fsqErr) {
            console.warn("[Places] Foursquare fetch failed, falling back to Groq:", fsqErr.message);
        }

        // Filter out utility entries
        const touristPlaces = rawPlaces.filter((p) => {
            const catName = getPrimaryCategory(p.categories);
            return p.name && p.name.trim() !== "" && !isUtility(catName);
        });

        let places = [];

        if (touristPlaces.length > 0) {
            // ── Step 2: Enrich with Groq for missing fields (batches of 5) ─────────
            places = await batchProcess(touristPlaces, 5, async (place) => {
                const photo = extractPhotoUrl(place.photos);

                const name = place.name.trim();
                const category = getPrimaryCategory(place.categories);
                const rating = place.rating ? parseFloat((place.rating / 2).toFixed(1)) : null;
                const reviewCount = null;
                const address = buildAddress(place.location);
                const lat = place.latitude || null;
                const lon = place.longitude || null;
                const { openingHours, closingHours } = parseHours(place.hours);
                const website = place.website || "";
                const fsqDescription = place.description || "";
                const country = place.location?.country || "India";

                let aiDetails = {
                    description: "",
                    estimatedEntryFee: "",
                    bestTimeToVisit: "",
                    recommendedVisitDuration: "",
                    travelTips: "",
                };

                try {
                    aiDetails = await generatePlaceDetails({ name, category, city: destination, country });
                } catch (groqErr) {
                    console.error(`[Groq] Failed for place "${name}":`, groqErr.message);
                }

                return {
                    placeId: place.fsq_place_id || `place_${Math.random().toString(36).substr(2, 9)}`,
                    name,
                    category,
                    rating,
                    reviewCount,
                    address,
                    lat,
                    lon,
                    latitude: lat,
                    longitude: lon,
                    openingHours,
                    closingHours,
                    website,
                    photo,
                    description: fsqDescription || aiDetails.description,
                    estimatedEntryFee: aiDetails.estimatedEntryFee,
                    bestTimeToVisit: aiDetails.bestTimeToVisit,
                    recommendedVisitDuration: aiDetails.recommendedVisitDuration,
                    travelTips: aiDetails.travelTips,
                    estimatedCost: 100,
                };
            });
        }

        // If Foursquare returned 0 places or failed, use Groq AI places generator
        if (places.length === 0) {
            console.log(`[Places] Using Groq AI fallback generation for destination "${destination}"`);
            places = await generatePlacesFallback(destination);
        }

        return res.status(200).json({
            success: true,
            destination,
            places,
        });
    } catch (error) {
        console.error("[Places] Error:", error.message);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch places. Please try again.",
        });
    }
};

export default getPlaces;