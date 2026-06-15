import { Itinerary } from "../models/Iternary.models.js";
import APIerror from "../utils/APIerror.js";
import APIresponse from "../utils/APIresponse.js";

 const createItineraryItem = async (req, res) => {
    try {

        const {
            tripId,
            type,
            name,
            category,
            estimatedCost
        } = req.body;

        const item = await Itinerary.create({
            tripId,
            type,
            name,
            category,
            estimatedCost
        });

        return res.status(200).json(new APIresponse(200 , item , "Iternaary item Created Successfully"));

    } catch (error) {

         throw new APIerror(500, "Something went wrong while creaing object");

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

const updateItineraryItem = async (req, res) => {

    try {

        const { itemId } = req.params;

        const updatedItem =
            await Itinerary.findByIdAndUpdate(
                itemId,
                req.body,
                {
                    new: true,
                    runValidators: true
                }
            );

        if (!updatedItem) {
        
            throw new APIerror(404 , "updated item not found")
        }

        return res.status(200).json(new APIresponse(200 ,updatedItem , "object updated successfully" ));

    } catch (error) {

          throw new APIerror(404 , " item not updated")

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

export {createItineraryItem , getTripItinerary , updateItineraryItem , deleteItineraryItem}