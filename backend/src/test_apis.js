import dotenv from "dotenv";
import mongoose from "mongoose";
import axios from "axios";
import Groq from "groq-sdk";

dotenv.config({ path: "./.env" });

console.log("Environment variables check:");
console.log("MONGODB_URI:", process.env.MONGODB_URI ? "Present" : "Missing");
console.log("DB_NAME:", process.env.DB_NAME ? "Present" : "Missing");
console.log("FOUR_SQUARE_API:", process.env.FOUR_SQUARE_API ? "Present" : "Missing");
console.log("GROQ_API_KEY:", process.env.GROQ_API_KEY ? "Present" : "Missing");
console.log("GEOAPIFY_API_KEY:", process.env.GEOAPIFY_API_KEY ? "Present" : "Missing");

async function testMongo() {
    try {
        const uri = `${process.env.MONGODB_URI}/${process.env.DB_NAME}`;
        await mongoose.connect(uri);
        console.log("✅ MongoDB Connection Successful!");
        await mongoose.disconnect();
    } catch (err) {
        console.error("❌ MongoDB Connection Failed:", err.message);
    }
}

async function testFoursquare() {
    try {
        const res = await axios.get("https://places-api.foursquare.com/places/search", {
            headers: {
                Authorization: `Bearer ${process.env.FOUR_SQUARE_API}`,
                Accept: "application/json",
                "X-Places-Api-Version": "2025-06-17",
            },
            params: { near: "Goa", limit: 2 }
        });
        console.log("✅ Foursquare API Successful! Results count:", res.data.results?.length);
    } catch (err) {
        console.error("❌ Foursquare API Failed:", err.response?.status, err.response?.data || err.message);
    }
}

async function testGroq() {
    try {
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: "Say hello in JSON format: {\"message\": \"hello\"}" }],
            response_format: { type: "json_object" }
        });
        console.log("✅ Groq API Successful! Response:", response.choices[0].message.content);
    } catch (err) {
        console.error("❌ Groq API Failed:", err.message);
    }
}

async function testGeoapify() {
    try {
        const res = await axios.get("https://api.geoapify.com/v1/routing", {
            params: {
                waypoints: "19.0760,72.8777|18.5204,73.8567",
                mode: "drive",
                apiKey: process.env.GEOAPIFY_API_KEY
            }
        });
        console.log("✅ Geoapify API Successful! Feature count:", res.data.features?.length);
    } catch (err) {
        console.error("❌ Geoapify API Failed:", err.response?.status, err.response?.data || err.message);
    }
}

async function runAll() {
    await testMongo();
    await testFoursquare();
    await testGroq();
    await testGeoapify();
}

runAll();
