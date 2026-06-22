import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/db/index.js";
import app from "./app.js";

dotenv.config({
    path:"./.env"
})

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

