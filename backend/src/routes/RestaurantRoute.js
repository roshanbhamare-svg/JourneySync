import { Router } from "express";
import getRestaurants from "../controllers/Restaurant.js";

const router = Router();

router.route("/getrestaurants/:tripId").get(getRestaurants);

export default router;