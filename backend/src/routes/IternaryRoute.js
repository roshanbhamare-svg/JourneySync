import { Router } from "express";

import {createBulkItinerary, getTripItinerary, confirmItinerary, deleteItineraryItem , getFinalItinerary} from "../controllers/Iternary.js";

const router = Router();

router.route("/iternary").post(createBulkItinerary);

router.route("/getiternary/:tripId").get(getTripItinerary);

router.route("/updateiternary/:tripId").put(confirmItinerary);

router.route("/deleteiternary/:itemId").delete(deleteItineraryItem);

router.route("/getfinaliternary/:tripId").get(getFinalItinerary)

export default router;