
import { Router } from "express";
import getFare from "../controllers/Transport.js";

const router = Router();

router.route("/fare").post(getFare);

export default router;