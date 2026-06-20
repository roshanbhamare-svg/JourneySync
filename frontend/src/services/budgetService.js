import api from "./api";

export const getBudgetTracker =
async (tripId) => {

    const response =
    await api.get(
        `/budget/${tripId}`
    );

    return response.data;
};