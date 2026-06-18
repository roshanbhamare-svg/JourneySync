import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema({

    tripId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Trip",
        required:true
    },

    name:{
        type:String,
        required:true
    },

    type:{
        type:String,
        enum:[
            "place",
            "restaurant",
            "transport"
        ],
        required:true
    },

    amount:{
        type:Number,
        required:true
    },

    expenseDate:{
        type:Date,
        required:true
    }

},{
    timestamps:true
});

export const Expense =mongoose.model("Expense",ExpenseSchema);