import api from "./api";

export const addExpense =
async(data)=>{

    const response =
    await api.post(
        "/expense/add",
        data
    );

    return response.data;
};

export const getExpenses =
async(tripId)=>{

    const response =
    await api.get(
        `/expense/getexpense/${tripId}`
    );

    return response.data;
};

export const getExpenseChart =
async(tripId)=>{

    const response =
    await api.get(
        `/expense/chart/${tripId}`
    );

    return response.data;
};

export const deleteExpense =
async(expenseId)=>{

    const response =
    await api.delete(
        `/expense/${expenseId}`
    );

    return response.data;
};