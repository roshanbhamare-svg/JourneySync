import { Itinerary } from "../models/Iternary.models.js";
import APIerror from "../utils/APIerror.js";
import APIresponse from "../utils/APIresponse.js";


const createBulkItinerary = async (req, res) => {

    try {

        const {
            tripId,
            items
        } = req.body;

        if (!tripId || !items?.length) {

            return res.status(400).json({
                success: false,
                message: "TripId and items are required"
            });

        }

        const formattedItems =
            items.map(item => ({

                tripId,

                type: item.type,

                name: item.name,

                category: item.category,

                estimatedCost:
                    item.estimatedCost || 0,

                day: null,

                order: 0

            }));

        const itineraries =
            await Itinerary.insertMany(
                formattedItems
            );

        return res.status(201).json({

            success: true,

            count:
                itineraries.length,

            itineraries

        });

    }
    catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


 const getTripItinerary = async (req, res) => {

    try {

        const { tripId } = req.params;

        const itinerary = await Itinerary.find({
            tripId
        });

        return res.status(200).json(new APIresponse(200 , itinerary , "Iternary items fetch successfully"));


    } catch (error) {

    throw new APIerror(500, "Something went wrong while fetching object");

    }
};

const confirmItinerary = async (req, res) => {

    try {

        const { tripId } = req.params;

        const { items } = req.body;

        if (!items || !items.length) {

            return res.status(400).json({
                success: false,
                message: "No itinerary items provided"
            });

        }

        const operations = items.map(item => ({

            updateOne: {

                filter: {
                    _id: item._id
                },

                update: {

                    $set: {
                        day: item.day,
                        order: item.order
                    }

                }

            }

        }));

        await Itinerary.bulkWrite(
            operations
        );

        return res.status(200).json(new APIresponse(200 , null , "Iternary Confirmed"))


    }
    catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

const deleteItineraryItem = async (req, res) => {

    try {

        const { itemId } = req.params;

        const deletedItem =
            await Itinerary.findByIdAndDelete(itemId);

        if (!deletedItem) {

              throw new APIerror(404 , " item not Deleted")

        }

        return res.status(200).json(new APIresponse(200 , null , "item deleted successfully"));

    } catch (error) {

         throw new APIerror(404 , " item not deleted")

    }
};


const getFinalItinerary = async (req,res)=>{

    try{

        const { tripId } =
        req.params;

        const itinerary =
        await Itinerary.find({
            tripId
        })
        .sort({
            day:1,
            order:1
        });

        return res.status(200).json({

            success:true,

            itinerary

        });

    }
    catch(error){

        return res.status(500).json({

            success:false,

            message:error.message

        });

    }

}

export {createBulkItinerary , getTripItinerary , confirmItinerary , deleteItineraryItem , getFinalItinerary}


