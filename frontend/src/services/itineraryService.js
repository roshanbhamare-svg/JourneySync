import api from "./api";

export const addPlacesToItinerary =
async (data) => {

    const response =
    await api.post(
        "/itinerary/bulk",
        data
    );

    return response.data;
};