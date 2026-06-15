import mongoose from "mongoose";

const TripSchema = new mongoose.Schema({
    source:{
        type:String,
        require:true
    },
    destination:{
        type:String,
        require:true
    },
    days:{
        type:Number,
        default:0,
        require:true
    },
    people:{
        type:Number,
        default:0,
        require:true
    },
    totalBudget:{
        type:Number,
        default:0,
        require:true
    },
    createdBy: {
    type:mongoose.Schema.Types.ObjectId,
     ref:"User",
     required:true
    }
},
{timestamps:true})

export const Trip = mongoose.model("Trip",TripSchema);