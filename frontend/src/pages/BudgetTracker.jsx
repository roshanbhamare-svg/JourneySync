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
            <h2>
                Loading...
            </h2>
        );

    }

    return (

       <ItineraryGuard>
         <div>

            <h1>
                Budget Tracker
            </h1>

            <h3>
                Total Budget :
                ₹{budget.totalBudget}
            </h3>

            <h3>
                Places Cost :
                ₹{budget.placesCost}
            </h3>

            <h3>
                Restaurant Cost :
                ₹{budget.restaurantCost}
            </h3>

            <h3>
                Transport Cost :
                ₹{budget.transportCost}
            </h3>

            <h3>
                Total Expense :
                ₹{budget.totalExpense}
            </h3>

            <h2>
                Remaining Budget :
                ₹{budget.remainingBudget}
            </h2>

            <PieChart
                width={500}
                height={400}
            >

                <Pie
                    data={
                        budget.chartData
                    }
                    dataKey="amount"
                    nameKey="category"
                    outerRadius={120}
                    label
                >

                    {
                        budget.chartData.map(
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

export default BudgetTracker;