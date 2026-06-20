import api from "./api";

export const calculateFare =
async(data)=>{

    const response =
    await api.post(
        "/transport/fare",
        data
    );

    return response.data;
};