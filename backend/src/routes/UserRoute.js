import { Router } from "express";
import {userregister} from "../controllers/UserRegister.js";

const router = Router()

router.route("/register").post(userregister)

export default router;