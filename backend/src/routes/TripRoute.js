import { Router } from "express";
import {CreateTrip , getTrip , updateTrip , deleteTrip , GetAllTrip}  from "../controllers/Trip.js";
import verifyJWT from "../middlewares/VerifyJWT.js";

const router = Router()

router.route("/create").post(verifyJWT , CreateTrip)
router.route("/getalltrip").get(verifyJWT , GetAllTrip)
router.route("/gettrip/:tripId").get(getTrip)
router.route("/updatetrip/:tripId").put(verifyJWT , updateTrip)
router.route("/deletetrip/:tripId").delete(verifyJWT , deleteTrip)


export default router