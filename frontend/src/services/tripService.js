import api from "./api";

export const createTrip = (tripData) => {
  return api.post("/trip/create", tripData);
};

export const getAllTrips = () => {
  return api.get("/trip/getalltrip");
};

export const getTripById = (tripId) => {
  return api.get(`/trip/gettrip/${tripId}`);
};

export const updateTrip = (tripId, tripData) => {
  return api.put(`/trip/updatetrip/${tripId}`, tripData);
};

export const deleteTrip = (tripId) => {
  return api.delete(`/trip/deletetrip/${tripId}`);
};