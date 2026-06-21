import { Router } from "express";
import {userregister , loginUser , logoutUser , refreshAccessToken} from "../controllers/UserRegister.js";
import verifyJWT from "../middlewares/VerifyJWT.js";

const router = Router()

router.route("/register").post(userregister)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT , logoutUser)


router.route("/refresh-token").post(refreshAccessToken);


export default router;