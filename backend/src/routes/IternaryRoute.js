import { Router } from "express";

import {createBulkItinerary, getTripItinerary, confirmItinerary, deleteItineraryItem , getFinalItinerary , getItineraryStatus } from "../controllers/Iternary.js";

const router = Router();

router.route("/bulk").post(createBulkItinerary);

router.route("/:tripId").get(getTripItinerary);

router.route("/confirm/:tripId").put(confirmItinerary);

router.route("/:itemId").delete(deleteItineraryItem);

router.route("/final/:tripId").get(getFinalItinerary)

router.route("/status/:tripId").get(getItineraryStatus)

export default router;