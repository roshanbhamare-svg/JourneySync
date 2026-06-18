import { Trip } from "../models/CreateTrip.models.js";
import { Itinerary } from "../models/Iternary.models.js";

const getBudgetTracker = async (req, res) => {

    try {

        const { tripId } = req.params;

        const trip =
            await Trip.findById(tripId);

        if (!trip) {

            return res.status(404).json({
                success: false,
                message: "Trip not found"
            });

        }

        const itinerary =
            await Itinerary.find({
                tripId
            });

        let placesCost = 0;
        let restaurantCost = 0;
        let transportCost = 0;

        itinerary.forEach((item) => {

            if (item.type === "place") {

                placesCost += item.estimatedCost;

            }

            else if (
                item.type === "restaurant"
            ) {

                restaurantCost += item.estimatedCost;

            }

            else if (
                item.type === "transport"
            ) {

                transportCost += item.estimatedCost;

            }

        });

        const totalExpense =

            placesCost +

            restaurantCost +

            transportCost;

        const remainingBudget =

            trip.totalBudget -

            totalExpense;

        const chartData = [

            {
                category: "Places",
                amount: placesCost
            },

            {
                category: "Restaurants",
                amount: restaurantCost
            },

            {
                category: "Transport",
                amount: transportCost
            }

        ];

        return res.status(200).json({

            success: true,

            totalBudget:
                trip.totalBudget,

            placesCost,

            restaurantCost,

            transportCost,

            totalExpense,

            remainingBudget,

            chartData

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

export default getBudgetTracker;