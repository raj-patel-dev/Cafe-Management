const mongoose = require("mongoose");
 
require ("dotenv").config();
const dns = require("node:dns/promises");
dns.setServers(["1.1.1.1"]);
const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected to Atlas successfully");
  } catch (error) {
    console.warn("MongoDB Atlas Connection Failed:", error.message);
    console.log("Attempting local MongoDB fallback...");
    try {
      await mongoose.connect("mongodb://127.0.0.1:27017/cafe_management");
      console.log("MongoDB Connected locally at mongodb://127.0.0.1:27017/cafe_management");
    } catch (localError) {
      console.error("Local MongoDB connection also failed:", localError.message);
      console.error("Please ensure MongoDB is running locally or check your Atlas IP whitelist.");
      // Do not exit, allow the developer to see the server running and address the db config
    }
  }
};

module.exports = connectDB;