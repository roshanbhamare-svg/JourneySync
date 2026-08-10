import axios from "axios";

// ── New Foursquare Places API base (v3 deprecated May 2026) ──────────────────
const FSQ_BASE = "https://places-api.foursquare.com";
const FSQ_API_VERSION = "2025-06-17";
const FSQ_KEY = () => process.env.FOUR_SQUARE_API;

/**
 * Tourist attraction category IDs for Foursquare new Places API.
 * Only real sightseeing/tourist categories.
 */
const TOURIST_CATEGORY_IDS = [
    "10027", // Historic Site
    "10000", // Arts & Entertainment
    "16000", // Outdoors & Recreation
    "16032", // Scenic Lookout
    "16019", // Garden
    "16011", // Beach
    "16040", // Waterfall
    "16008", // Amusement Park
    "12047", // Water Park
    "12065", // Museum
    "12072", // Performing Arts Venue
    "10034", // Temple / Religious Site
    "10051", // Landmark
    "16020", // Lake
    "16017", // Nature Reserve
    "12034", // Monument / Statue
    "16028", // National Park
    "16029", // Planetarium
    "16006", // Aquarium
].join(",");

const RESTAURANT_CATEGORY_IDS = "13065"; // Restaurant (dining top-level)

/** Standard Foursquare headers for new API */
const fsqHeaders = () => ({
    Authorization: `Bearer ${FSQ_KEY()}`,
    Accept: "application/json",
    "X-Places-Api-Version": FSQ_API_VERSION,
});

/**
 * Retry a promise-returning function once on failure.
 */
const withRetry = async (fn) => {
    try {
        return await fn();
    } catch (err) {
        console.warn("[Foursquare] Retrying after error:", err.message);
        await new Promise((r) => setTimeout(r, 500));
        return await fn();
    }
};

/**
 * Parse opening hours from Foursquare hours object.
 * New API: hours.regular[].open and hours.regular[].close are strings like "0900", "2200"
 */
export const parseHours = (hoursObj) => {
    if (!hoursObj || !hoursObj.regular || hoursObj.regular.length === 0) {
        if (hoursObj?.display) {
            // Use display string if available
            return { openingHours: hoursObj.display, closingHours: "" };
        }
        return { openingHours: "", closingHours: "" };
    }

    const first = hoursObj.regular[0];
    const formatTime = (t) => {
        if (!t) return "";
        const str = String(t).padStart(4, "0");
        const h = parseInt(str.slice(0, 2), 10);
        const m = str.slice(2);
        const ampm = h >= 12 ? "PM" : "AM";
        const hour12 = h % 12 === 0 ? 12 : h % 12;
        return `${hour12}:${m} ${ampm}`;
    };

    return {
        openingHours: formatTime(first.open),
        closingHours: formatTime(first.close),
    };
};

/**
 * Extract first photo URL from the inline photos array in the new API response.
 * New API includes photos directly in the search response under place.photos[]
 */
export const extractPhotoUrl = (photos) => {
    if (!Array.isArray(photos) || photos.length === 0) return null;
    const photo = photos[0];
    if (photo?.prefix && photo?.suffix) {
        return `${photo.prefix}original${photo.suffix}`;
    }
    return null;
};

/**
 * Build a complete address string from the new Foursquare location object.
 * New API: location.formatted_address or location.address + locality + region
 */
export const buildAddress = (location) => {
    if (!location) return "";
    if (location.formatted_address) return location.formatted_address;
    const parts = [
        location.address,
        location.locality,
        location.region,
        location.country,
    ].filter(Boolean);
    return parts.join(", ");
};

/**
 * Extract the primary category name from the new Foursquare categories array.
 */
export const getPrimaryCategory = (categories) => {
    if (!Array.isArray(categories) || categories.length === 0) return "Attraction";
    return categories[0]?.name || "Attraction";
};

/**
 * Search for tourist attractions near a city using the NEW Foursquare Places API.
 * @param {string} city - Destination city name
 * @param {number} limit - Max results (1-50)
 * @returns {Promise<Array>} Array of new Foursquare place objects
 */
export const searchPlaces = async (city, limit = 20) => {
    return withRetry(async () => {
        const response = await axios.get(`${FSQ_BASE}/places/search`, {
            headers: fsqHeaders(),
            params: {
                near: city,
                fsq_category_ids: TOURIST_CATEGORY_IDS,
                limit,
                sort: "POPULARITY",
                fields: [
                    "fsq_place_id",
                    "name",
                    "categories",
                    "rating",
                    "popularity",
                    "price",
                    "location",
                    "latitude",
                    "longitude",
                    "hours",
                    "website",
                    "photos",
                    "description",
                ].join(","),
            },
        });
        return response.data.results || [];
    });
};

/**
 * Search for restaurants near a city using the NEW Foursquare Places API.
 * @param {string} city - Destination city name
 * @param {number} limit - Max results (1-50)
 * @returns {Promise<Array>} Array of new Foursquare place objects
 */
export const searchRestaurants = async (city, limit = 20) => {
    return withRetry(async () => {
        const response = await axios.get(`${FSQ_BASE}/places/search`, {
            headers: fsqHeaders(),
            params: {
                near: city,
                fsq_category_ids: RESTAURANT_CATEGORY_IDS,
                limit,
                sort: "POPULARITY",
                fields: [
                    "fsq_place_id",
                    "name",
                    "categories",
                    "rating",
                    "popularity",
                    "price",
                    "location",
                    "latitude",
                    "longitude",
                    "hours",
                    "website",
                    "photos",
                    "description",
                ].join(","),
            },
        });
        return response.data.results || [];
    });
};

/**
 * Geocode a location name using the new Foursquare Places search.
 * Returns { lat, lon, city, country } or throws if not found.
 * @param {string} query - Location name (e.g. "Sai Baba Temple, Shirdi")
 */
export const geocodeLocation = async (query) => {
    return withRetry(async () => {
        const response = await axios.get(`${FSQ_BASE}/places/search`, {
            headers: fsqHeaders(),
            params: {
                query,
                limit: 1,
                fields: "fsq_place_id,name,latitude,longitude,location",
            },
        });

        const results = response.data.results || [];
        if (results.length === 0) {
            throw new Error(`Location not found: ${query}`);
        }

        const place = results[0];
        const lat = place.latitude;
        const lon = place.longitude;

        if (!lat || !lon) {
            throw new Error(`No coordinates for: ${query}`);
        }

        return {
            lat,
            lon,
            city:
                place.location?.locality ||
                place.location?.region ||
                place.location?.post_town ||
                "",
            country: place.location?.country || "",
        };
    });
};
