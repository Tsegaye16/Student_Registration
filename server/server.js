import dotenv from "dotenv";
import mongoose from "mongoose";
import { initializeDatabase } from "./db.js";
import { sequelize } from "./db.js";
import app from "./app.js";

// Load environment variables
dotenv.config();

mongoose
  .connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB:", err);
  });
const port = 4000;
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
