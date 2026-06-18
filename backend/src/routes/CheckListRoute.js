import {Router} from "express";
import {createChecklist , getChecklist , updateChecklist , deleteChecklist} from "../controllers/CheckList.js";

const router = Router()

router.route("/create").post(createChecklist)
router.route("/update/:id").put(updateChecklist)
router.route("/get/:tripId").get(getChecklist)
router.route("/delete/:id").delete(deleteChecklist)


export default router;


