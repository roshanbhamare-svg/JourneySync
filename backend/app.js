import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import UserRoute from "./src/routes/UserRoute.js"
import TripRoute from "./src/routes/TripRoute.js"
import IternaryRoute from "./src/routes/IternaryRoute.js"
import placeRouter from "./src/routes/PlacesRoute.js";


const app = express()

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/users" , UserRoute)
app.use("/api/v1/trip" , TripRoute)

app.use("/api/v1/it" ,IternaryRoute)


app.use("/api/v1/places", placeRouter);

export default app;

