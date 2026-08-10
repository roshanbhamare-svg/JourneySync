import dotenv from "dotenv";
dotenv.config({
    path: "./.env"
});

import mongoose from "mongoose";
import express from "express";
import connectDB from "./src/db/index.js";
import app from "./app.js";

connectDB()
.then(() => {
    const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`SERVER RUNNING AT PORT ${PORT}`);
});
})
.catch((err)=>{
    console.log("mongodb connection failed" , err);
})

