import axios from "axios";

/**
 * Calculate road distance and estimated travel time between two coordinates
 * using the Geoapify Routing API (existing key, kept only for routing).
 *
 * @param {number} srcLat
 * @param {number} srcLon
 * @param {number} dstLat
 * @param {number} dstLon
 * @returns {Promise<{ distanceKm: number, durationMinutes: number }>}
 */
export const getRouteDistance = async (srcLat, srcLon, dstLat, dstLon) => {
    const doRequest = async () => {
        const response = await axios.get(
            "https://api.geoapify.com/v1/routing",
            {
                params: {
                    waypoints: `${srcLat},${srcLon}|${dstLat},${dstLon}`,
                    mode: "drive",
                    apiKey: process.env.GEOAPIFY_API_KEY,
                },
            }
        );

        const feature = response.data.features?.[0];
        if (!feature) {
            throw new Error("No route found between provided coordinates.");
        }

        const distanceMeters = feature.properties.distance || 0;
        const durationSeconds = feature.properties.time || 0;

        return {
            distanceKm: parseFloat((distanceMeters / 1000).toFixed(2)),
            durationMinutes: Math.round(durationSeconds / 60),
        };
    };

    try {
        return await doRequest();
    } catch (err) {
        console.warn("[Transport] Retrying routing after error:", err.message);
        return await doRequest();
    }
};
