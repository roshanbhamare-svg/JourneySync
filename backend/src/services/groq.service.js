import Groq from "groq-sdk";

// Lazy-initialize the Groq client
let groqClient = null;
const getGroqClient = () => {
    if (!groqClient) {
        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            console.error("Warning: GROQ_API_KEY environment variable is not defined.");
        }
        groqClient = new Groq({ apiKey });
    }
    return groqClient;
};

// ── In-memory caches (keyed by place name) ──────────────────────────────────
const placeCache = new Map();
const restaurantCache = new Map();
const transportCache = new Map();

/**
 * Strip markdown code fences from an LLM JSON response.
 */
const cleanJsonResponse = (content) => {
    let clean = content.trim();
    if (clean.startsWith("```json")) clean = clean.substring(7);
    else if (clean.startsWith("```")) clean = clean.substring(3);
    if (clean.endsWith("```")) clean = clean.substring(0, clean.length - 3);
    return clean.trim();
};

/**
 * Generate ONLY the 5 missing descriptive fields for a tourist place.
 * Does NOT generate ratings, opening hours, addresses, or coordinates.
 *
 * @param {{ name: string, category: string, city: string, country: string }} info
 * @returns {Promise<{ description, estimatedEntryFee, bestTimeToVisit, recommendedVisitDuration, travelTips }>}
 */
export const generatePlaceDetails = async ({ name, category, city, country }) => {
    const DEFAULT = {
        description: "",
        estimatedEntryFee: "",
        bestTimeToVisit: "",
        recommendedVisitDuration: "",
        travelTips: "",
    };

    if (!name) return DEFAULT;

    const cacheKey = `${name}__${city}`;
    if (placeCache.has(cacheKey)) return placeCache.get(cacheKey);

    try {
        const groq = getGroqClient();
        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "user",
                    content: `You are an expert travel guide.

A traveller is visiting the following tourist attraction and needs helpful information.

Place Name: ${name}
Category: ${category}
City: ${city}
Country: ${country}

Generate ONLY the following missing information. Do NOT generate or invent ratings, opening hours, addresses, or coordinates — those come from official sources.

Return ONLY valid JSON with these exact keys:

{
  "description": "2-3 sentences describing what makes this place special.",
  "estimatedEntryFee": "Realistic entry fee for an adult (e.g. Free, ₹50, ₹200–₹500).",
  "bestTimeToVisit": "Best time of day or season to visit.",
  "recommendedVisitDuration": "How long to spend here (e.g. 1-2 hours).",
  "travelTips": "1-2 practical tips for first-time visitors."
}

Rules:
- Return JSON only.
- No markdown, no explanation.
- Be specific and realistic for this city/country.
- Do NOT hallucinate ratings, hours, addresses, or coordinates.`,
                },
            ],
            response_format: { type: "json_object" },
        });

        const raw = response.choices?.[0]?.message?.content || "{}";
        const data = JSON.parse(cleanJsonResponse(raw));

        const result = {
            description: data.description || "",
            estimatedEntryFee: data.estimatedEntryFee || "",
            bestTimeToVisit: data.bestTimeToVisit || "",
            recommendedVisitDuration: data.recommendedVisitDuration || "",
            travelTips: data.travelTips || "",
        };

        placeCache.set(cacheKey, result);
        return result;
    } catch (error) {
        console.error(`[Groq] generatePlaceDetails failed for "${name}":`, error.message);
        return DEFAULT;
    }
};

/**
 * Generate ONLY the 4 missing descriptive fields for a restaurant.
 * Does NOT generate ratings, addresses, coordinates, or opening hours.
 *
 * @param {{ name: string, city: string, country: string }} info
 * @returns {Promise<{ description, averageCostForTwo, mustTryDishes, travelTips }>}
 */
export const generateRestaurantDetails = async ({ name, city, country }) => {
    const DEFAULT = {
        description: "",
        averageCostForTwo: "",
        mustTryDishes: "",
        travelTips: "",
    };

    if (!name) return DEFAULT;

    const cacheKey = `${name}__${city}`;
    if (restaurantCache.has(cacheKey)) return restaurantCache.get(cacheKey);

    try {
        const groq = getGroqClient();
        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "user",
                    content: `You are a food and travel expert.

A traveller wants to dine at the following restaurant and needs helpful information.

Restaurant Name: ${name}
City: ${city}
Country: ${country}

Generate ONLY the following missing information. Do NOT generate or invent ratings, opening hours, addresses, or coordinates.

Return ONLY valid JSON with these exact keys:

{
  "description": "1-2 sentences describing the restaurant's cuisine and ambiance.",
  "averageCostForTwo": "Realistic average cost for two people (e.g. ₹400–₹600).",
  "mustTryDishes": "3-5 popular dishes comma-separated (e.g. Butter Chicken, Garlic Naan, Lassi).",
  "travelTips": "1 practical tip for dining here (e.g. reservation needed, cash only, etc.)."
}

Rules:
- Return JSON only.
- No markdown, no explanation.
- Be specific and realistic for this city/country.
- Do NOT hallucinate ratings, hours, addresses, or coordinates.`,
                },
            ],
            response_format: { type: "json_object" },
        });

        const raw = response.choices?.[0]?.message?.content || "{}";
        const data = JSON.parse(cleanJsonResponse(raw));

        const result = {
            description: data.description || "",
            averageCostForTwo: data.averageCostForTwo || "",
            mustTryDishes: data.mustTryDishes || "",
            travelTips: data.travelTips || "",
        };

        restaurantCache.set(cacheKey, result);
        return result;
    } catch (error) {
        console.error(`[Groq] generateRestaurantDetails failed for "${name}":`, error.message);
        return DEFAULT;
    }
};

/**
 * Recommend local transport options based on actual road distance and travel time.
 * Groq only receives factual route data — it does NOT calculate distance.
 *
 * @param {{ city: string, source: string, destination: string, roadDistanceKm: number, estimatedTravelTime: string }} info
 * @returns {Promise<{ recommendedTransport, estimatedFare, reason, alternativeTransport, alternativeFare, moneySavingTip }>}
 */
export const generateLocalRideOptions = async ({
    city,
    source,
    destination,
    roadDistanceKm,
    estimatedTravelTime,
}) => {
    const DEFAULT = {
        recommendedTransport: "Auto Rickshaw",
        estimatedFare: "₹80–₹120",
        reason: "Auto rickshaws are typically the most convenient for local travel.",
        alternativeTransport: "Shared Auto",
        alternativeFare: "₹20–₹40",
        moneySavingTip: "Take a shared auto or city bus to save money.",
    };

    const cacheKey = `${source}→${destination}`;
    if (transportCache.has(cacheKey)) return transportCache.get(cacheKey);

    try {
        const groq = getGroqClient();
        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "user",
                    content: `You are an experienced local travel guide in India.

A traveller needs to commute between two places in the same city.

City: ${city || "India"}
Source: ${source}
Destination: ${destination}
Road Distance: ${roadDistanceKm} km
Estimated Travel Time: ${estimatedTravelTime}

Based on this real route data, recommend the best local transport option.

Consider local options: Auto Rickshaw, Taxi, Shared Auto, City Bus, Metro, E-Rickshaw, Cycle Rickshaw, Walk.

Return ONLY valid JSON with these exact keys:

{
  "recommendedTransport": "Primary recommended transport mode",
  "estimatedFare": "Realistic fare range in INR (e.g. ₹80–₹120)",
  "reason": "1 sentence explaining why this is the best option for this route.",
  "alternativeTransport": "A cheaper or different alternative transport mode",
  "alternativeFare": "Realistic fare for the alternative (e.g. ₹20–₹30)",
  "moneySavingTip": "1 practical money-saving tip specific to this route and city."
}

Rules:
- Return JSON only.
- No markdown, no explanation.
- Use realistic Indian transport fares appropriate for the distance.
- Consider city-specific transport availability (e.g. Metro may not be in small cities).
- Do NOT calculate or guess distance — use the provided ${roadDistanceKm} km.`,
                },
            ],
            response_format: { type: "json_object" },
        });

        const raw = response.choices?.[0]?.message?.content || "{}";
        const data = JSON.parse(cleanJsonResponse(raw));

        const result = {
            recommendedTransport: data.recommendedTransport || DEFAULT.recommendedTransport,
            estimatedFare: data.estimatedFare || DEFAULT.estimatedFare,
            reason: data.reason || DEFAULT.reason,
            alternativeTransport: data.alternativeTransport || DEFAULT.alternativeTransport,
            alternativeFare: data.alternativeFare || DEFAULT.alternativeFare,
            moneySavingTip: data.moneySavingTip || DEFAULT.moneySavingTip,
        };

        transportCache.set(cacheKey, result);
        return result;
    } catch (error) {
        console.error("[Groq] generateLocalRideOptions failed:", error.message);
        return DEFAULT;
    }
};

/**
 * Fallback generator for Places when Foursquare API fails or returns 0 results.
 */
export const generatePlacesFallback = async (destination) => {
    try {
        const groq = getGroqClient();
        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "user",
                    content: `You are a world-class travel guide. Generate 12 top real tourist attractions in and around ${destination}.
Return ONLY valid JSON with key "places" as an array of objects:
{
  "places": [
    {
      "placeId": "groq_place_1",
      "name": "Exact Attraction Name",
      "category": "Historic Site / Temple / Beach / Viewpoint / Museum / Park",
      "rating": 4.6,
      "reviewCount": 1200,
      "address": "Realistic address in ${destination}",
      "openingHours": "9:00 AM",
      "closingHours": "6:00 PM",
      "website": "",
      "photo": null,
      "description": "2-3 fascinating sentences describing this place.",
      "estimatedEntryFee": "Free or ₹100",
      "bestTimeToVisit": "Morning or Evening",
      "recommendedVisitDuration": "1-2 hours",
      "travelTips": "1-2 useful travel tips.",
      "estimatedCost": 100
    }
  ]
}`
                }
            ],
            response_format: { type: "json_object" }
        });

        const raw = response.choices?.[0]?.message?.content || "{}";
        const data = JSON.parse(cleanJsonResponse(raw));
        return data.places || [];
    } catch (err) {
        console.error("[Groq] generatePlacesFallback failed:", err.message);
        return [];
    }
};

/**
 * Fallback generator for Restaurants when Foursquare API fails or returns 0 results.
 */
export const generateRestaurantsFallback = async (destination) => {
    try {
        const groq = getGroqClient();
        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "user",
                    content: `You are an expert culinary guide. Generate 12 top real, popular dining spots and restaurants in ${destination}.
Return ONLY valid JSON with key "restaurants" as an array of objects:
{
  "restaurants": [
    {
      "placeId": "groq_rest_1",
      "name": "Exact Restaurant Name",
      "category": "Fine Dining / Local Cuisine / Seafood / Café / Street Food",
      "rating": 4.5,
      "reviewCount": 850,
      "address": "Realistic address in ${destination}",
      "openingHours": "11:00 AM",
      "closingHours": "11:00 PM",
      "website": "",
      "photo": null,
      "description": "1-2 sentences describing the food, ambiance, and specialty.",
      "averageCostForTwo": "₹400–₹800",
      "mustTryDishes": "Dish 1, Dish 2, Dish 3",
      "travelTips": "Reservation recommended or Cash only",
      "estimatedcost": 300
    }
  ]
}`
                }
            ],
            response_format: { type: "json_object" }
        });

        const raw = response.choices?.[0]?.message?.content || "{}";
        const data = JSON.parse(cleanJsonResponse(raw));
        return data.restaurants || [];
    } catch (err) {
        console.error("[Groq] generateRestaurantsFallback failed:", err.message);
        return [];
    }
};
