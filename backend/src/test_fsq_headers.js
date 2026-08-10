import dotenv from "dotenv";
import axios from "axios";

dotenv.config({ path: "./.env" });

const apiKey = process.env.FOUR_SQUARE_API;

async function testHeader(name, headers) {
    console.log(`Testing ${name}...`);
    try {
        const res = await axios.get("https://places-api.foursquare.com/places/search", {
            headers,
            params: { near: "Goa", limit: 2 }
        });
        console.log(`✅ ${name} SUCCESS! Count:`, res.data.results?.length);
        if (res.data.results?.length > 0) {
            console.log("Sample place:", res.data.results[0].name);
        }
        return true;
    } catch (err) {
        console.error(`❌ ${name} Failed:`, err.response?.status, err.response?.data || err.message);
        return false;
    }
}

async function run() {
    await testHeader("Authorization Bearer", {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
        "X-Places-Api-Version": "2025-06-17",
    });
    await testHeader("Authorization Plain", {
        Authorization: apiKey,
        Accept: "application/json",
        "X-Places-Api-Version": "2025-06-17",
    });
    await testHeader("X-Api-Key", {
        "X-Api-Key": apiKey,
        Accept: "application/json",
        "X-Places-Api-Version": "2025-06-17",
    });
    await testHeader("api-key header", {
        "api-key": apiKey,
        Accept: "application/json",
    });
}

run();
