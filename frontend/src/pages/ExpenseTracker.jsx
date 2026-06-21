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

const COLORS = ["#6366f1", "#34d399", "#fbbf24", "#f43f5e", "#a855f7"];

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

                <h1 style={{ marginBottom: "24px" }}>Expense Tracker</h1>

                <div className="budget-grid">
                    
                    <div>
                        <div className="glass-panel" style={{ marginBottom: "24px" }}>
                            <h3 style={{ marginBottom: "16px" }}>Add New Expense</h3>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Expense Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="e.g. Museum Tickets"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Category</label>
                                        <select
                                            name="type"
                                            value={formData.type}
                                            onChange={handleChange}
                                        >
                                            <option value="place">Place</option>
                                            <option value="restaurant">Restaurant</option>
                                            <option value="transport">Transport</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Amount (₹)</label>
                                        <input
                                            type="number"
                                            name="amount"
                                            placeholder="0"
                                            value={formData.amount}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Expense Date</label>
                                    <input
                                        type="date"
                                        name="expenseDate"
                                        value={formData.expenseDate}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <button type="submit" className="btn-primary" style={{ marginTop: "8px" }}>
                                    Add Expense
                                </button>
                            </form>
                        </div>

                        {chartData.length > 0 && (
                            <div className="chart-wrapper">
                                <PieChart width={380} height={300}>
                                    <Pie
                                        data={chartData}
                                        dataKey="amount"
                                        nameKey="category"
                                        outerRadius={80}
                                        innerRadius={50}
                                        paddingAngle={3}
                                        label
                                    >
                                        {
                                            chartData.map((entry, index) => (
                                                <Cell
                                                    key={index}
                                                    fill={COLORS[index % COLORS.length]}
                                                />
                                            ))
                                        }
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{ 
                                            background: "rgba(13, 18, 38, 0.95)", 
                                            borderColor: "var(--border-color)", 
                                            borderRadius: "8px", 
                                            color: "#fff" 
                                        }} 
                                    />
                                    <Legend />
                                </PieChart>
                            </div>
                        )}
                    </div>

                    <div>
                        <div className="glass-panel" style={{ height: "100%", overflowX: "auto" }}>
                            <h3 style={{ marginBottom: "16px" }}>Transaction History</h3>
                            {expenses.length === 0 ? (
                                <p style={{ color: "var(--text-secondary)", fontStyle: "italic" }}>No expenses added yet.</p>
                            ) : (
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Name</th>
                                            <th>Category</th>
                                            <th>Amount</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            expenses.map(expense => (
                                                <tr key={expense._id}>
                                                    <td>
                                                        {new Date(expense.expenseDate).toLocaleDateString()}
                                                    </td>
                                                    <td style={{ fontWeight: "500" }}>
                                                        {expense.name}
                                                    </td>
                                                    <td>
                                                        <span className={`timeline-badge ${expense.type}`} style={{ fontSize: "0.7rem" }}>
                                                            {expense.type}
                                                        </span>
                                                    </td>
                                                    <td style={{ color: "var(--success)", fontWeight: "600" }}>
                                                        ₹{expense.amount}
                                                    </td>
                                                    <td>
                                                        <button 
                                                            className="btn-danger" 
                                                            style={{ padding: "6px 12px", fontSize: "0.8rem" }}
                                                            onClick={() => handleDelete(expense._id)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>

                </div>

            </div>
        </ItineraryGuard>

    );

}

export default ExpenseTracker;