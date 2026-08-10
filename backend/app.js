import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import UserRoute from "./src/routes/UserRoute.js"
import TripRoute from "./src/routes/TripRoute.js"
import IternaryRoute from "./src/routes/IternaryRoute.js"
import placeRouter from "./src/routes/PlacesRoute.js";
import RestaurantRoute from "./src/routes/RestaurantRoute.js"
import transportRouter from "./src/routes/TransportRoute.js";
import BudgetRouter from "./src/routes/BudgetTrackerRoute.js"
import expenseRouter from "./src/routes/ExpenseTrackerRoute.js"
import checklistRouter from "./src/routes/CheckListRoute.js";

const app = express()

app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "https://journey-sync-ten.vercel.app"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(null, true); // Allow during dev / cross-origin
        }
    },
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/users" , UserRoute)
app.use("/api/v1/trip" , TripRoute)

app.use("/api/v1/itinerary" ,IternaryRoute)


app.use("/api/v1/places", placeRouter);

app.use("/api/v1/restaurant",RestaurantRoute);



app.use("/api/v1/transport",transportRouter);

app.use("/api/v1/budget",BudgetRouter);

app.use("/api/v1/expense" , expenseRouter);

app.use("/api/v1/checklist" , checklistRouter);

app.get("/test", (req,res)=>{
    res.json({
        success:true,
        message:"Backend working"
    });
});

// Centralized Global Error Handling Middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || err.status || 500;
    const message = err.message || "Internal Server Error";
    console.error(`[Error] ${req.method} ${req.url} - ${statusCode}: ${message}`);
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});

export default app;

