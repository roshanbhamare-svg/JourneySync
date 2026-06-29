import Groq from "groq-sdk";

// Initialize Groq client lazily to avoid crashing if API key is missing at load time
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

// In-memory cache to avoid duplicate calls during requests
const placeCache = new Map();
const restaurantCache = new Map();

/**
 * Clean LLM response to ensure it's a valid JSON string.
 */
const cleanJsonResponse = (content) => {
    let clean = content.trim();
    if (clean.startsWith("```json")) {
        clean = clean.substring(7);
    } else if (clean.startsWith("```")) {
        clean = clean.substring(3);
    }
    if (clean.endsWith("```")) {
        clean = clean.substring(0, clean.length - 3);
    }
    return clean.trim();
};

/**
 * Generate realistic details for a tourist place.
 * @param {string} placeName 
 * @returns {Promise<object>}
 */
export const generatePlaceDetails = async (placeName) => {
    if (!placeName) {
        return {
            description: "",
            estimatedFare: "",
            openingTime: "",
            closingTime: ""
        };
    }

    const trimmedName = placeName.trim();
    if (placeCache.has(trimmedName)) {
        return placeCache.get(trimmedName);
    }

    try {
        const groq = getGroqClient();
        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "user",
                    content: `You are an expert travel guide.

Generate realistic information for the following tourist place.

Place:
${trimmedName}

Return ONLY valid JSON.

{
"description":"",
"estimatedFare":"",
"openingTime":"",
"closingTime":""
}

Rules:

* Description should be 2-3 sentences.
* Fare should be realistic.
* Opening and closing timings should be realistic.
* No markdown.
* No explanation.
* Return JSON only.`
                }
            ],
            response_format: { type: "json_object" }
        });

        const rawContent = response.choices?.[0]?.message?.content || "{}";
        const cleaned = cleanJsonResponse(rawContent);
        const data = JSON.parse(cleaned);

        // Validate structure and fill defaults
        const result = {
            description: data.description || "",
            estimatedFare: data.estimatedFare || "",
            openingTime: data.openingTime || "",
            closingTime: data.closingTime || ""
        };

        placeCache.set(trimmedName, result);
        return result;
    } catch (error) {
        console.error(`Error in generatePlaceDetails for "${trimmedName}":`, error);
        // Fallback response on failure
        return {
            description: "",
            estimatedFare: "",
            openingTime: "",
            closingTime: ""
        };
    }
};

/**
 * Generate realistic details for a restaurant.
 * @param {string} restaurantName 
 * @returns {Promise<object>}
 */
export const generateRestaurantDetails = async (restaurantName) => {
    if (!restaurantName) {
        return {
            description: "",
            averageCost: "",
            openingTime: "",
            closingTime: "",
            famousDishes: []
        };
    }

    const trimmedName = restaurantName.trim();
    if (restaurantCache.has(trimmedName)) {
        return restaurantCache.get(trimmedName);
    }

    try {
        const groq = getGroqClient();
        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "user",
                    content: `You are a food and travel expert.

Generate realistic restaurant information.

Restaurant:
${trimmedName}

Return ONLY valid JSON.

{
"description":"",
"averageCost":"",
"openingTime":"",
"closingTime":"",
"famousDishes":[]
}

Rules:

* Description should be short.
* Average cost should be realistic.
* Timings should be realistic.
* Famous dishes should contain 3-5 dishes.
* Return JSON only.
* No markdown.`
                }
            ],
            response_format: { type: "json_object" }
        });

        const rawContent = response.choices?.[0]?.message?.content || "{}";
        const cleaned = cleanJsonResponse(rawContent);
        const data = JSON.parse(cleaned);

        // Validate structure and fill defaults
        const result = {
            description: data.description || "",
            averageCost: data.averageCost || "",
            openingTime: data.openingTime || "",
            closingTime: data.closingTime || "",
            famousDishes: Array.isArray(data.famousDishes) ? data.famousDishes : []
        };

        restaurantCache.set(trimmedName, result);
        return result;
    } catch (error) {
        console.error(`Error in generateRestaurantDetails for "${trimmedName}":`, error);
        // Fallback response on failure
        return {
            description: "",
            averageCost: "",
            openingTime: "",
            closingTime: "",
            famousDishes: []
        };
    }
};

/**
 * Generate local ride options between two locations using Groq AI.
 * @param {string} source - Starting location name
 * @param {string} destination - Ending location name
 * @param {number} distanceKm - Road distance in kilometres
 * @param {string} city - Destination city name (may be empty)
 * @returns {Promise<object>} Structured transport options JSON
 */
export const generateLocalRideOptions = async (source, destination, distanceKm, city = "") => {
    const cityLine = city ? `City: ${city}` : "";

    const prompt = `You are an experienced local travel guide.

A traveller wants to travel between two places.

Source: ${source}
Destination: ${destination}
Road Distance: ${distanceKm} km
${cityLine}

Estimate realistic transportation options for this journey.

Consider:
* Metro
* Local Bus
* Auto Rickshaw
* Taxi
* Ride Sharing (Ola/Uber)

Use realistic Indian transportation prices.

Return ONLY valid JSON.

{
  "recommendedTransport": "",
  "reason": "",
  "estimatedTravelTime": "",
  "options": [
    {
      "type": "Metro",
      "estimatedFare": 0,
      "estimatedTime": "",
      "available": true
    },
    {
      "type": "Bus",
      "estimatedFare": 0,
      "estimatedTime": "",
      "available": true
    },
    {
      "type": "Auto",
      "estimatedFare": 0,
      "estimatedTime": "",
      "available": true
    },
    {
      "type": "Taxi",
      "estimatedFare": 0,
      "estimatedTime": "",
      "available": true
    },
    {
      "type": "Ride Share",
      "estimatedFare": 0,
      "estimatedTime": "",
      "available": true
    }
  ],
  "moneySavingSuggestion": ""
}

Rules:
- Return JSON only.
- No markdown.
- No explanations.
- If Metro is unavailable for this journey, set available=false.
- The recommendation should balance cost, travel time, and convenience.
- estimatedFare must be a number (integer), not a string.`;

    try {
        const groq = getGroqClient();
        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            response_format: { type: "json_object" }
        });

        const rawContent = response.choices?.[0]?.message?.content || "{}";
        const cleaned = cleanJsonResponse(rawContent);
        const data = JSON.parse(cleaned);

        // Validate and return with safe defaults
        return {
            recommendedTransport: data.recommendedTransport || "Auto",
            reason: data.reason || "",
            estimatedTravelTime: data.estimatedTravelTime || "",
            options: Array.isArray(data.options) ? data.options : [],
            moneySavingSuggestion: data.moneySavingSuggestion || ""
        };
    } catch (error) {
        console.error("Error in generateLocalRideOptions:", error);
        // Fallback with basic estimates based on distance
        const baseFare = Math.round(distanceKm * 15);
        return {
            recommendedTransport: "Auto",
            reason: "Auto rickshaws are typically the most convenient option for local travel.",
            estimatedTravelTime: `${Math.round(distanceKm * 4)} mins`,
            options: [
                { type: "Metro", estimatedFare: Math.round(distanceKm * 3), estimatedTime: `${Math.round(distanceKm * 3)} mins`, available: false },
                { type: "Bus", estimatedFare: Math.round(distanceKm * 2), estimatedTime: `${Math.round(distanceKm * 5)} mins`, available: true },
                { type: "Auto", estimatedFare: baseFare, estimatedTime: `${Math.round(distanceKm * 4)} mins`, available: true },
                { type: "Taxi", estimatedFare: Math.round(distanceKm * 20), estimatedTime: `${Math.round(distanceKm * 4)} mins`, available: true },
                { type: "Ride Share", estimatedFare: Math.round(distanceKm * 18), estimatedTime: `${Math.round(distanceKm * 4)} mins`, available: true }
            ],
            moneySavingSuggestion: "Taking the bus is the most economical option for this route."
        };
    }
};
