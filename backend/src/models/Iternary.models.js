import mongoose from "mongoose";

const ItinerarySchema = new mongoose.Schema(
{
    tripId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Trip",
        required: true
    },

    type: {
        type: String,
        enum: ["place", "restaurant", "transport"],
        required: true
    },

    name: {
        type: String,
        required: true
    },

    category: {
        type: String
    },

    estimatedCost: {
        type: Number,
        default: 0
    },

    day: {
        type: Number,
        default:null
    },

    order:{
        type:Number,
        default:0
    }
},
{
    timestamps: true
});

export const Itinerary = mongoose.model("Itinerary", ItinerarySchema);