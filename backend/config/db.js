import mongoose from "mongoose";

export const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME,
    });

    console.log("mongodb connected");
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};
