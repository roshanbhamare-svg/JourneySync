import dotenv from "dotenv";
import axios from "axios";

dotenv.config({ path: "./.env" });

const apiKey = process.env.FOUR_SQUARE_API;

async function testApiKeyWithVersion() {
    console.log("Testing api-key header with X-Places-Api-Version...");
    try {
        const res = await axios.get("https://places-api.foursquare.com/places/search", {
            headers: {
                "api-key": apiKey,
                Accept: "application/json",
                "X-Places-Api-Version": "2025-06-17",
            },
            params: { near: "Goa", limit: 2 }
        });
        console.log("✅ SUCCESS! Count:", res.data.results?.length);
        if (res.data.results?.length > 0) {
            console.log("Sample place name:", res.data.results[0].name);
        }
    } catch (err) {
        console.error("❌ Failed:", err.response?.status, err.response?.data || err.message);
    }
}

async function testBearerWithVersion() {
    console.log("Testing Authorization Bearer with version...");
    try {
        const res = await axios.get("https://places-api.foursquare.com/places/search", {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                Accept: "application/json",
                "X-Places-Api-Version": "2025-06-17",
            },
            params: { near: "Goa", limit: 2 }
        });
        console.log("✅ SUCCESS! Count:", res.data.results?.length);
    } catch (err) {
        console.error("❌ Failed:", err.response?.status, err.response?.data || err.message);
    }
}

async function run() {
    await testApiKeyWithVersion();
    await testBearerWithVersion();
}

run();
