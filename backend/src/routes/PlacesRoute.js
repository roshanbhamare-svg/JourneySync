
import { Router } from "express";
import  getPlaces from "../controllers/Places.js";

const router = Router();

router.route("/getplaces/:tripId").get(getPlaces);

export default router;