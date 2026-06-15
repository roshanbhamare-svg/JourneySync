import { Router } from "express";

import {createItineraryItem, getTripItinerary, updateItineraryItem, deleteItineraryItem } from "../controllers/Iternary.js";

const router = Router();

router.route("/iternary").post(createItineraryItem);

router.route("/getiternary/:tripId").get(getTripItinerary);

router.route("/updateiternary/:itemId").put(updateItineraryItem);

router.route("/deleteiternary/:itemId").delete(deleteItineraryItem);

export default router;