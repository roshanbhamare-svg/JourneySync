import mongoose, { mongo } from "mongoose";

const connectDB = async () => {
  await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
  console.log("DB COONECTDE");
}

export default connectDB;