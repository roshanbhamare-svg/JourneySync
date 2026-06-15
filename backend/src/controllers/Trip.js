import { Trip } from "../models/CreateTrip.models.js";
import APIresponse from "../utils/APIresponse.js";
import APIerror from "../utils/APIerror.js";

const CreateTrip = async(req , res) => {
    const {source , destination , days , people , totalBudget} = req.body

    if (!source || !destination) {
     throw new APIerror(
        400,
         "Source and destination are required"
     );
    }

   const trip = await Trip.create({
       source,
       destination,
       days,
       people,
       totalBudget,
       createdBy:req.user._id

   })

   return res.status(200).json(new APIresponse(200 ,trip , "Trip created succesfully" ))
}

const GetAllTrip = async(req , res) => {
     const trips = await Trip.find({
        createdBy: req.user._id,
    });

    return res.status(200).json(
        new APIresponse(
            200,
            trips,
            "Trips fetched successfully"
        )
    );
}

const getTrip = async (req, res) => {
    const trip = await Trip.findById(req.params.tripId);

    if (!trip) {
        throw new APIerror(404, "Trip not found");
    }

    return res.status(200).json(new APIresponse(200 , trip , "single trip fetched"));
};

const updateTrip = async (req, res) => {
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
                people,
                days,
                totalBudget
            }
        },
        {
            new: true
        }
    );

    if (!trip) {
        throw new APIerror(404, "Trip not found");
    }

    return res.status(200).json(
        new APIresponse(
            200,
            trip,
            "Trip updated successfully"
        )
    );
};

const deleteTrip = async (req, res) => {

    const { tripId } = req.params;

    const trip = await Trip.findOneAndDelete({
        _id: tripId,
        createdBy: req.user._id
    });

    if (!trip) {
        throw new APIerror(404, "Trip not found");
    }

    return res.status(200).json(
        new APIresponse(
            200,
            {},
            "Trip deleted successfully"
        )
    );
};


export  {CreateTrip , GetAllTrip , getTrip , updateTrip , deleteTrip}