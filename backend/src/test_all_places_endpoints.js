import dotenv from "dotenv";
import axios from "axios";

dotenv.config({ path: "./.env" });

const apiKey = process.env.FOUR_SQUARE_API;

async function testEndpoint(url, headers, params) {
    try {
        const res = await axios.get(url, { headers, params });
        console.log(`✅ SUCCESS [${url}] Status:`, res.status, "Keys:", Object.keys(res.data));
        return res.data;
    } catch (err) {
        console.log(`❌ FAIL [${url}] Status:`, err.response?.status, err.response?.data || err.message);
        return null;
    }
}

async function run() {
    console.log("Key:", apiKey);
    
    // 1. New Places API
    await testEndpoint("https://places-api.foursquare.com/places/search", 
        { Authorization: apiKey, "X-Places-Api-Version": "2025-06-17" }, 
        { near: "Goa" }
    );
    await testEndpoint("https://places-api.foursquare.com/places/search", 
        { Authorization: `Bearer ${apiKey}`, "X-Places-Api-Version": "2025-06-17" }, 
        { near: "Goa" }
    );
    await testEndpoint("https://places-api.foursquare.com/places/search", 
        { Authorization: apiKey, "X-Places-Api-Version": "2025-01-01" }, 
        { near: "Goa" }
    );

    // 2. Geoapify Places as alternative/fallback check
    console.log("\nTesting Geoapify Places API as potential fallback...");
    await testEndpoint("https://api.geoapify.com/v2/places", 
        {}, 
        { categories: "tourism.sights", text: "Goa", apiKey: process.env.GEOAPIFY_API_KEY }
    );
}

run();
