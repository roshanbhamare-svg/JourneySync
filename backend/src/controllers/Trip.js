import { Trip } from "../models/CreateTrip.models.js";
import APIresponse from "../utils/APIresponse.js";

const CreateTrip = async(req , res) => {
    const {source , destination , days , people , totalBudget} = req.body

   const trip = await Trip.create({
       source,
       destination,
       days,
       people,
       totalBudget
   })

   return res.status(200).json(new APIresponse(200 ,trip , "Trip created succesfully" ))
}

export default CreateTrip