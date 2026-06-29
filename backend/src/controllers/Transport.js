
import axios from "axios";
import APIerror from "../utils/APIerror.js";
import { generateLocalRideOptions } from "../services/groq.service.js";

/**
 * Local Ride Planner — estimates realistic transport options between two local locations.
 * Uses Geoapify for geocoding + routing, Groq for AI fare estimation.
 */
const getFare = async (req, res) => {

    try {

        const { source, destination } = req.body;

        if (!source || !destination) {
            return res.status(400).json({
                success: false,
                message: "Source and destination are required"
            });
        }

        // ── Step 1: Geocode source ──────────────────────────────────────────
        const sourceResponse = await axios.get(
            "https://api.geoapify.com/v1/geocode/search",
            {
                params: {
                    text: source,
                    apiKey: process.env.GEOAPIFY_API_KEY
                }
            }
        );

        const sourceFeature = sourceResponse.data.features?.[0];

        if (!sourceFeature) {
            return res.status(404).json({
                success: false,
                message: "Source location not found. Please try a more specific location name."
            });
        }

        const sourceLat = sourceFeature.properties.lat;
        const sourceLon = sourceFeature.properties.lon;

        // ── Step 2: Geocode destination + extract city ──────────────────────
        const destinationResponse = await axios.get(
            "https://api.geoapify.com/v1/geocode/search",
            {
                params: {
                    text: destination,
                    apiKey: process.env.GEOAPIFY_API_KEY
                }
            }
        );

        const destinationFeature = destinationResponse.data.features?.[0];

        if (!destinationFeature) {
            return res.status(404).json({
                success: false,
                message: "Destination location not found. Please try a more specific location name."
            });
        }

        const destinationLat = destinationFeature.properties.lat;
        const destinationLon = destinationFeature.properties.lon;

        // Extract city name from geocoding result
        const city =
            destinationFeature.properties.city ||
            destinationFeature.properties.county ||
            destinationFeature.properties.state ||
            "";

        // ── Step 3: Get road distance via Geoapify Routing ──────────────────
        const routeResponse = await axios.get(
            "https://api.geoapify.com/v1/routing",
            {
                params: {
                    waypoints: `${sourceLat},${sourceLon}|${destinationLat},${destinationLon}`,
                    mode: "drive",
                    apiKey: process.env.GEOAPIFY_API_KEY
                }
            }
        );

        const routeFeature = routeResponse.data.features?.[0];

        if (!routeFeature) {
            return res.status(404).json({
                success: false,
                message: "Could not calculate route between these locations."
            });
        }

        const distanceMeters = routeFeature.properties.distance;
        const distanceKm = parseFloat((distanceMeters / 1000).toFixed(2));

        // ── Step 4: Ask Groq for realistic transport options ────────────────
        const rideOptions = await generateLocalRideOptions(
            source,
            destination,
            distanceKm,
            city
        );

        // ── Respond ─────────────────────────────────────────────────────────
        return res.status(200).json({
            success: true,
            source,
            destination,
            distance: distanceKm,
            city,
            ...rideOptions
        });

    } catch (error) {
        console.error("Error in getFare (Local Ride Planner):", error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to calculate ride options. Please try again."
        });
    }

};

export default getFare;