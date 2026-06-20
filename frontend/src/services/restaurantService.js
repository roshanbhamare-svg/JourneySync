import api from "./api";

export const getRestaurants =
async (tripId) => {

    const response =
    await api.get(
        `/restaurant/getrestaurants/${tripId}`
    );

    return response.data;
};