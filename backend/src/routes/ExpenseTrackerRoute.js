import {Router} from "express";
import {addExpense ,getExpenses , deleteExpense , getExpenseChart} from "../controllers/ExpenseTracker.js";



const router = Router();

router.route("/add").post(addExpense)

router.route("/getexpense/:tripId").get(getExpenses)

router.route("/:expenseId").delete(deleteExpense)

router.route("/chart/:tripId").get(getExpenseChart)

export default router;

