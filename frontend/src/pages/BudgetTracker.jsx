import { useEffect } from "react";
import { useState } from "react";
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
    getBudgetTracker
}
from "../services/budgetService";

import ItineraryGuard from "../components/ItineraryGuard";

const COLORS = ["#6366f1", "#34d399", "#fbbf24", "#f43f5e", "#a855f7"];

function BudgetTracker() {

    const { tripId } =
    useParams();

    const [budget,
    setBudget] =
    useState(null);

    useEffect(() => {

        loadBudget();

    }, []);

    const loadBudget =
    async () => {

        try {

            const data =
            await getBudgetTracker(
                tripId
            );

            setBudget(data);

        }
        catch(error){

            console.log(error);

        }

    };

    if(!budget){

        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
                <h2>Loading budget tracker...</h2>
            </div>
        );

    }

    return (

       <ItineraryGuard>
         <div>

            <h1 style={{ marginBottom: "24px" }}>Budget Tracker</h1>

            <div className="budget-grid">
                
                <div className="budget-stats">
                    <div className="budget-stat-card highlight">
                        <div className="budget-stat-label">Total Budget</div>
                        <div className="budget-stat-value">₹{budget.totalBudget}</div>
                    </div>
                    
                    <div className="budget-stat-card">
                        <div className="budget-stat-label">Places Cost</div>
                        <div className="budget-stat-value" style={{ color: "#6366f1" }}>₹{budget.placesCost}</div>
                    </div>

                    <div className="budget-stat-card">
                        <div className="budget-stat-label">Restaurant Cost</div>
                        <div className="budget-stat-value" style={{ color: "#34d399" }}>₹{budget.restaurantCost}</div>
                    </div>

                    <div className="budget-stat-card">
                        <div className="budget-stat-label">Transport Cost</div>
                        <div className="budget-stat-value" style={{ color: "#fbbf24" }}>₹{budget.transportCost}</div>
                    </div>

                    <div className="budget-stat-card">
                        <div className="budget-stat-label">Total Expense</div>
                        <div className="budget-stat-value" style={{ color: "#f43f5e" }}>₹{budget.totalExpense}</div>
                    </div>

                    <div className="budget-stat-card" style={{ gridColumn: "span 2", borderTop: "2px solid var(--success)" }}>
                        <div className="budget-stat-label">Remaining Budget</div>
                        <div className="budget-stat-value success">₹{budget.remainingBudget}</div>
                    </div>
                </div>

                <div className="chart-wrapper">
                    <div style={{ position: "relative" }}>
                        <PieChart
                            width={400}
                            height={350}
                        >

                            <Pie
                                data={
                                    budget.chartData
                                }
                                dataKey="amount"
                                nameKey="category"
                                outerRadius={100}
                                innerRadius={60}
                                paddingAngle={3}
                                label
                            >

                                {
                                    budget.chartData.map(
                                        (entry,index)=>(
                                        <Cell
                                            key={index}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                        )
                                    )
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
                </div>

            </div>

        </div>
       </ItineraryGuard>

    );

}

export default BudgetTracker;