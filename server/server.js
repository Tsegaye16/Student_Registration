import express from "express";
import dotenv from "dotenv";
import { initializeDatabase } from "./db.js";
import app from "./app.js";

// Load environment variables
dotenv.config();

// Sync and initialize the database, then start the server
const startServer = async () => {
  try {
    await initializeDatabase(); // Ensures the DB is ready and connected
    console.log("Database synchronized");

    // Start the server
    const port = process.env.PORT || 4000; // Default to 4000 if no env variable set
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database or sync models:", error);
  }
};

startServer();
