import api from "./api";

export const createChecklist =
async(data)=>{

    const response =
    await api.post(
        "/checklist/create",
        data
    );

    return response.data;
};

export const getChecklist =
async(tripId)=>{

    const response =
    await api.get(
        `/checklist/${tripId}`
    );

    return response.data;
};

export const updateChecklist =
async(id,data)=>{

    const response =
    await api.put(
        `/checklist/${id}`,
        data
    );

    return response.data;
};

export const deleteChecklist =
async(id)=>{

    const response =
    await api.delete(
        `/checklist/${id}`
    );

    return response.data;
};