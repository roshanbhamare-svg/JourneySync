import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend
}
from "recharts";

import {
    addExpense,
    getExpenses,
    getExpenseChart,
    deleteExpense
}
from "../services/expenseService";

import ItineraryGuard from "../components/ItineraryGuard";

function ExpenseTracker(){

    const { tripId } =
    useParams();

    const [expenses,
    setExpenses] =
    useState([]);

    const [chartData,
    setChartData] =
    useState([]);

    const [formData,
    setFormData] =
    useState({

        name:"",

        type:"place",

        amount:"",

        expenseDate:""

    });

    useEffect(()=>{

        loadExpenses();

        loadChart();

    },[]);

    const loadExpenses =
    async()=>{

        try{

            const data =
            await getExpenses(
                tripId
            );

            setExpenses(
                data.expenses
            );

        }
        catch(error){

            console.log(error);

        }

    };

    const loadChart =
    async()=>{

        try{

            const data =
            await getExpenseChart(
                tripId
            );

            setChartData(
                data.chartData
            );

        }
        catch(error){

            console.log(error);

        }

    };

    const handleChange =
    (e)=>{

        setFormData({

            ...formData,

            [e.target.name]:
            e.target.value

        });

    };

    const handleSubmit =
    async(e)=>{

        e.preventDefault();

        try{

            await addExpense({

                ...formData,

                tripId

            });

            setFormData({

                name:"",

                type:"place",

                amount:"",

                expenseDate:""

            });

            loadExpenses();

            loadChart();

        }
        catch(error){

            console.log(error);

        }

    };

    const handleDelete =
    async(id)=>{

        try{

            await deleteExpense(
                id
            );

            loadExpenses();

            loadChart();

        }
        catch(error){

            console.log(error);

        }

    };

    return(

        <ItineraryGuard>
            <div>

            <h1>
                Expense Tracker
            </h1>

            <form
            onSubmit={
                handleSubmit
            }
            >

                <input
                    type="text"
                    name="name"
                    placeholder="Expense Name"
                    value={formData.name}
                    onChange={handleChange}
                />

                <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                >

                    <option value="place">
                        Place
                    </option>

                    <option value="restaurant">
                        Restaurant
                    </option>

                    <option value="transport">
                        Transport
                    </option>

                </select>

                <input
                    type="number"
                    name="amount"
                    placeholder="Amount"
                    value={formData.amount}
                    onChange={handleChange}
                />

                <input
                    type="date"
                    name="expenseDate"
                    value={
                        formData.expenseDate
                    }
                    onChange={
                        handleChange
                    }
                />

                <button
                type="submit"
                >
                    Add Expense
                </button>

            </form>

            <hr />

            <h2>
                Expense Table
            </h2>

            <table border="1">

                <thead>

                    <tr>

                        <th>
                            Date
                        </th>

                        <th>
                            Name
                        </th>

                        <th>
                            Type
                        </th>

                        <th>
                            Amount
                        </th>

                        <th>
                            Action
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {

                        expenses.map(
                            expense=>(

                            <tr
                            key={
                            expense._id
                            }
                            >

                                <td>
                                    {
                                    new Date(
                                    expense.expenseDate
                                    ).toLocaleDateString()
                                    }
                                </td>

                                <td>
                                    {
                                    expense.name
                                    }
                                </td>

                                <td>
                                    {
                                    expense.type
                                    }
                                </td>

                                <td>
                                    ₹{
                                    expense.amount
                                    }
                                </td>

                                <td>

                                    <button
                                    onClick={()=>handleDelete(
                                        expense._id
                                    )}
                                    >
                                        Delete
                                    </button>

                                </td>

                            </tr>

                            )
                        )

                    }

                </tbody>

            </table>

            <hr />

            <PieChart
            width={500}
            height={400}
            >

                <Pie
                    data={chartData}
                    dataKey="amount"
                    nameKey="category"
                    outerRadius={120}
                    label
                >

                    {

                        chartData.map(
                            (entry,index)=>(
                            <Cell
                            key={index}
                            />
                            )
                        )

                    }

                </Pie>

                <Tooltip />

                <Legend />

            </PieChart>

        </div>
        </ItineraryGuard>

    );

}

export default ExpenseTracker;