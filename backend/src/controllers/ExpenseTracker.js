import { Expense } from "../models/Expense.models.js";

const addExpense =async(req,res)=>{

    try{

        const {
            tripId,
            name,
            type,
            amount,
            expenseDate
        } = req.body;

        const expense =
        await Expense.create({

            tripId,
            name,
            type,
            amount,
            expenseDate

        });

        return res.status(201).json({

            success:true,

            expense

        });

    }
    catch(error){

        return res.status(500).json({

            success:false,

            message:error.message

        });

    }

};

const getExpenses = async(req,res)=>{

    try{

        const { tripId } = req.params;

        const expenses = await Expense.find({
            tripId
        }).sort({

            expenseDate:-1

        });

        return res.status(200).json({

            success:true,

            expenses

        });

    }
    catch(error){

        return res.status(500).json({

            success:false,

            message:error.message

        });

    }

};

const deleteExpense = async(req,res)=>{
    try{
        const { expenseId } =req.params;
        await Expense.findByIdAndDelete(
            expenseId
        );

        return res.status(200).json({
            success:true,
            message:
            "Expense deleted"

        });

    }
    catch(error){

        return res.status(500).json({

            success:false,

            message:error.message

        });

    }

};

const getExpenseChart = async(req,res)=>{

    try{

        const { tripId } = req.params;

        const expenses =
        await Expense.find({
            tripId
        });

        let place = 0;
        let restaurant = 0;
        let transport = 0;

        expenses.forEach(
        (expense)=>{

            if(
                expense.type ===
                "place"
            ){

                place +=
                expense.amount;

            }

            else if(
                expense.type ===
                "restaurant"
            ){

                restaurant +=
                expense.amount;

            }

            else if(
                expense.type ===
                "transport"
            ){

                transport +=
                expense.amount;

            }

        });

        return res.status(200).json({

            success:true,

            chartData:[

                {
                    category:"Places",
                    amount:place
                },

                {
                    category:"Restaurants",
                    amount:restaurant
                },

                {
                    category:"Transport",
                    amount:transport
                }

            ]

        });

    }
    catch(error){

        return res.status(500).json({

            success:false,

            message:error.message

        });

    }

};

export  {addExpense ,getExpenses , deleteExpense , getExpenseChart};