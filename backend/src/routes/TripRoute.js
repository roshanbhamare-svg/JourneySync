import { Router } from "express";
import CreateTrip from "../controllers/Trip.js";

const router = Router()

router.route("/create").post(CreateTrip)

export default router