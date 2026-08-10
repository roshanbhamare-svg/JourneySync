import { geocodeLocation } from "../services/foursquare.service.js";
import { getRouteDistance } from "../services/transport.service.js";
import { generateLocalRideOptions } from "../services/groq.service.js";

/**
 * Local Transport Planner
 *
 * Step 1: Geocode source + destination in parallel using Foursquare
 * Step 2: Get real road distance + travel time using Geoapify Routing
 * Step 3: Ask Groq to recommend local transport based on factual route data
 */
const getFare = async (req, res) => {
    try {
        const { source, destination } = req.body;

        if (!source || !destination) {
            return res.status(400).json({
                success: false,
                message: "Source and destination are required.",
            });
        }

        // ── Step 1: Geocode both locations in parallel via Foursquare ─────────
        let srcGeo = { lat: 19.0760, lon: 72.8777, city: source, country: "India" };
        let dstGeo = { lat: 18.5204, lon: 73.8567, city: destination, country: "India" };

        try {
            const [sRes, dRes] = await Promise.allSettled([
                geocodeLocation(source),
                geocodeLocation(destination),
            ]);
            if (sRes.status === "fulfilled" && sRes.value) srcGeo = sRes.value;
            if (dRes.status === "fulfilled" && dRes.value) dstGeo = dRes.value;
        } catch (geoErr) {
            console.warn("[Transport] Geocoding warning:", geoErr.message);
        }

        // Extract city from whichever geocode result has it
        const city = srcGeo.city || dstGeo.city || "";
        const country = srcGeo.country || dstGeo.country || "India";

        // ── Step 2: Get real road distance + duration via Geoapify routing ────
        let distanceKm = 0;
        let durationMinutes = 0;

        try {
            const route = await getRouteDistance(
                srcGeo.lat,
                srcGeo.lon,
                dstGeo.lat,
                dstGeo.lon
            );
            distanceKm = route.distanceKm;
            durationMinutes = route.durationMinutes;
        } catch (routeErr) {
            console.warn("[Transport] Routing failed, using straight-line estimate:", routeErr.message);
            // Fallback: straight-line Haversine approximation
            const R = 6371;
            const dLat = ((dstGeo.lat - srcGeo.lat) * Math.PI) / 180;
            const dLon = ((dstGeo.lon - srcGeo.lon) * Math.PI) / 180;
            const a =
                Math.sin(dLat / 2) ** 2 +
                Math.cos((srcGeo.lat * Math.PI) / 180) *
                Math.cos((dstGeo.lat * Math.PI) / 180) *
                Math.sin(dLon / 2) ** 2;
            distanceKm = parseFloat((R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(2));
            durationMinutes = Math.round(distanceKm * 4); // rough estimate: ~15 km/h avg urban speed
        }

        const estimatedTravelTime =
            durationMinutes < 60
                ? `${durationMinutes} minutes`
                : `${Math.floor(durationMinutes / 60)} hr ${durationMinutes % 60} min`;

        // ── Step 3: Ask Groq for transport recommendations ─────────────────────
        const transportOptions = await generateLocalRideOptions({
            city,
            source,
            destination,
            roadDistanceKm: distanceKm,
            estimatedTravelTime,
        });

        // ── Respond ────────────────────────────────────────────────────────────
        return res.status(200).json({
            success: true,
            source,
            destination,
            distance: distanceKm,
            travelTime: estimatedTravelTime,
            city,
            ...transportOptions,
        });
    } catch (error) {
        console.error("[Transport] Unexpected error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to calculate transport options. Please try again.",
        });
    }
};

export default getFare;