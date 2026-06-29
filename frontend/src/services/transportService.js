import api from "./api";

/**
 * Get local ride options between two locations.
 * Calls Geoapify (geocoding + routing) + Groq (AI fare estimation) on the backend.
 * @param {{ source: string, destination: string }} data
 */
export const getLocalRideOptions = async (data) => {

    const response =
    await api.post(
        "/transport/fare",
        data
    );

    return response.data;

};