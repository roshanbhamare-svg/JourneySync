import {Router} from "express";

import getBudgetTracker from "../controllers/BudgetTracker.js"

const router = Router();

router.route("/getbudgettracker/:tripId").get(getBudgetTracker)

export default router;