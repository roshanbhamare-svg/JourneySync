
import mongoose from "mongoose";

const ChecklistSchema = new mongoose.Schema({

    tripId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Trip",
        required: true
    },

    task: {
        type: String,
        required: true
    },

    completed: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
});

export const Checklist = mongoose.model("Checklist",ChecklistSchema);