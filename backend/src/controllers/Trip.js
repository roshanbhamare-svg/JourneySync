import { Trip } from "../models/CreateTrip.models.js";
import { Itinerary } from "../models/Iternary.models.js";
import { Expense } from "../models/Expense.models.js";
import { Checklist } from "../models/CheckList.models.js";
import APIresponse from "../utils/APIresponse.js";
import APIerror from "../utils/APIerror.js";

const CreateTrip = async (req, res) => {
    try {
        const { source, destination, days, people, totalBudget } = req.body;

        if (!source || !destination) {
            return res.status(400).json({ success: false, message: "Source and destination are required" });
        }

        const trip = await Trip.create({
            source,
            destination,
            days: Number(days) || 0,
            people: Number(people) || 0,
            totalBudget: Number(totalBudget) || 0,
            createdBy: req.user._id
        });

        return res.status(201).json(new APIresponse(201, trip, "Trip created successfully"));
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Failed to create trip" });
    }
};

const GetAllTrip = async (req, res) => {
    try {
        const trips = await Trip.find({
            createdBy: req.user._id,
        }).sort({ createdAt: -1 });

        return res.status(200).json(
            new APIresponse(
                200,
                trips,
                "Trips fetched successfully"
            )
        );
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Failed to fetch trips" });
    }
};

const getTrip = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.tripId);

        if (!trip) {
            return res.status(404).json({ success: false, message: "Trip not found" });
        }

        return res.status(200).json(new APIresponse(200, trip, "Single trip fetched"));
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Failed to fetch trip" });
    }
};

const updateTrip = async (req, res) => {
    try {
        const { tripId } = req.params;

        const {
            source,
            destination,
            people,
            days,
            totalBudget
        } = req.body;

        const trip = await Trip.findOneAndUpdate(
            {
                _id: tripId,
                createdBy: req.user._id
            },
            {
                $set: {
                    source,
                    destination,
                    people: Number(people) || 0,
                    days: Number(days) || 0,
                    totalBudget: Number(totalBudget) || 0
                }
            },
            {
                new: true
            }
        );

        if (!trip) {
            return res.status(404).json({ success: false, message: "Trip not found" });
        }

        return res.status(200).json(
            new APIresponse(
                200,
                trip,
                "Trip updated successfully"
            )
        );
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Failed to update trip" });
    }
};

const deleteTrip = async (req, res) => {
    try {
        const { tripId } = req.params;

        const trip = await Trip.findOneAndDelete({
            _id: tripId,
            createdBy: req.user._id
        });

        if (!trip) {
            return res.status(404).json({ success: false, message: "Trip not found" });
        }

        // Cascade delete related records
        await Promise.all([
            Itinerary.deleteMany({ tripId }),
            Expense.deleteMany({ tripId }),
            Checklist.deleteMany({ tripId })
        ]);

        return res.status(200).json(
            new APIresponse(
                200,
                {},
                "Trip deleted successfully"
            )
        );
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Failed to delete trip" });
    }
};

export { CreateTrip, GetAllTrip, getTrip, updateTrip, deleteTrip };