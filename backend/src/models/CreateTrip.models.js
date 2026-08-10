import mongoose from "mongoose";

const TripSchema = new mongoose.Schema({
    source:{
        type:String,
        required:true
    },
    destination:{
        type:String,
        required:true
    },
    days:{
        type:Number,
        default:0,
        required:true
    },
    people:{
        type:Number,
        default:0,
        required:true
    },
    totalBudget:{
        type:Number,
        default:0,
        required:true
    },
    createdBy: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
},
{timestamps:true})

export const Trip = mongoose.model("Trip",TripSchema);