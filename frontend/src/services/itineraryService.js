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

export const getTripItinerary =
async (tripId) => {

    const response =
    await api.get(
        `/itinerary/${tripId}`
    );

    return response.data;
};

export const confirmItinerary =
async (tripId,data) => {

    const response =
    await api.put(
        `/itinerary/confirm/${tripId}`,
        data
    );

    return response.data;
};

export const getFinalItinerary =
async (tripId) => {

    const response =
    await api.get(
        `/itinerary/final/${tripId}`
    );

    return response.data;
};

export const deleteItineraryItem =
async (itemId) => {

    const response =
    await api.delete(
        `/itinerary/${itemId}`
    );

    return response.data;
};

export const getItineraryStatus =
async (tripId) => {

    const response =
    await api.get(
        `/itinerary/status/${tripId}`
    );

    return response.data;
};