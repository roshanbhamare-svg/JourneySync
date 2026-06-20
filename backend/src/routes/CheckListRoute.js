import {Router} from "express";
import {createChecklist , getChecklist , updateChecklist , deleteChecklist} from "../controllers/CheckList.js";

const router = Router()

router.route("/create").post(createChecklist)
router.route("/:id").put(updateChecklist)
router.route("/:tripId").get(getChecklist)
router.route("/:id").delete(deleteChecklist)


export default router;


