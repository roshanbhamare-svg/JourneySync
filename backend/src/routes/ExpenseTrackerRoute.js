import {Router} from "express";
import {addExpense ,getExpenses , deleteExpense , getExpenseChart} from "../controllers/ExpenseTracker.js";



const router = Router();

router.route("/addexpense").post(addExpense)

router.route("/getallexpense").get(getExpenses)

router.route("/deleteexpense").get(deleteExpense)

router.route("/getexpensechart").get(getExpenseChart)

export default router;

