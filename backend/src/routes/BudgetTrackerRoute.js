import {Router} from "express";

import getBudgetTracker from "../controllers/BudgetTracker.js"

const router = Router();

router.route("/:tripId").get(getBudgetTracker)

export default router;