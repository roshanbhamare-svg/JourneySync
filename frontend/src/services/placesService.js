import api from "./api";

export const getPlaces =
async (tripId) => {

    const response =
    await api.get(
        `/places/getplaces/${tripId}`
    );

    return response.data;
};