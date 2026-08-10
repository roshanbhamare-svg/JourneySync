import dotenv from "dotenv";
import axios from "axios";

dotenv.config({ path: "./.env" });

const apiKey = process.env.FOUR_SQUARE_API;

async function testV3Standard() {
    console.log("Testing api.foursquare.com/v3/places/search with key direct header...");
    try {
        const res = await axios.get("https://api.foursquare.com/v3/places/search", {
            headers: {
                Authorization: apiKey,
                Accept: "application/json"
            },
            params: { near: "Goa", limit: 2 }
        });
        console.log("✅ api.foursquare.com/v3 SUCCESS! Count:", res.data.results?.length);
    } catch (err) {
        console.error("❌ api.foursquare.com/v3 Failed:", err.response?.status, err.response?.data || err.message);
    }
}

async function testV3Bearer() {
    console.log("Testing api.foursquare.com/v3/places/search with Bearer...");
    try {
        const res = await axios.get("https://api.foursquare.com/v3/places/search", {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                Accept: "application/json"
            },
            params: { near: "Goa", limit: 2 }
        });
        console.log("✅ api.foursquare.com/v3 Bearer SUCCESS! Count:", res.data.results?.length);
    } catch (err) {
        console.error("❌ api.foursquare.com/v3 Bearer Failed:", err.response?.status, err.response?.data || err.message);
    }
}

async function testNewApiDirectHeader() {
    console.log("Testing places-api.foursquare.com with direct header...");
    try {
        const res = await axios.get("https://places-api.foursquare.com/places/search", {
            headers: {
                Authorization: apiKey,
                Accept: "application/json",
                "X-Places-Api-Version": "2025-06-17",
            },
            params: { near: "Goa", limit: 2 }
        });
        console.log("✅ places-api.foursquare.com direct header SUCCESS! Count:", res.data.results?.length);
    } catch (err) {
        console.error("❌ places-api.foursquare.com direct header Failed:", err.response?.status, err.response?.data || err.message);
    }
}

async function run() {
    await testV3Standard();
    await testV3Bearer();
    await testNewApiDirectHeader();
}

run();
