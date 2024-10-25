import { Sequelize } from "sequelize";
import pkg from "pg";
const { Client } = pkg;
import dotenv from "dotenv";

// Load environment variables from .env
dotenv.config({ path: "./.env" });

// Database configuration
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT || 5432;

// Function to create the database if it doesn't exist
async function createDatabase() {
  const client = new Client({
    user: DB_USER,
    host: DB_HOST,
    password: DB_PASSWORD,
    port: DB_PORT,
    database: "postgres",
  });

  try {
    await client.connect();
    const res = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = '${DB_NAME}'`
    );

    if (res.rowCount === 0) {
      // Database doesn't exist, create it
      await client.query(`CREATE DATABASE "${DB_NAME}"`); // Added double quotes to handle case-sensitivity
      console.log(`Database ${DB_NAME} created successfully.`);
    } else {
      console.log(`Database ${DB_NAME} already exists.`);
    }
  } catch (err) {
    if (err.code === "42P04") {
      console.log(`Database ${DB_NAME} already exists.`);
    } else {
      console.error("Error creating database:", err);
    }
  } finally {
    await client.end();
  }
}

// Initialize Sequelize after ensuring the database exists
export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: "postgres",
  logging: false,
});

// Sync and connect to the database with a retry mechanism
export const initializeDatabase = async () => {
  await createDatabase(); // Ensure the database exists before proceeding

  // Adding a retry mechanism to wait for the database to be fully ready
  const maxRetries = 5;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      await sequelize.authenticate();
      console.log("Connection has been established successfully.");
      return sequelize;
    } catch (error) {
      console.error(
        `Unable to connect to the database, retrying... (${
          retries + 1
        }/${maxRetries})`
      );
      retries += 1;
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds before retrying
    }
  }

  throw new Error("Unable to connect to the database after multiple retries.");
};
