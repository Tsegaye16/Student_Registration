import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please insert course name"], // Custom error message
      unique: true, // Enforces unique course names
      trim: true, // Removes extra spaces
    },
    duration: {
      type: String,
      required: [true, "Please insert course duration"],
      trim: true,
    },
    price: {
      type: String, // Use String for price if flexibility is required, or use Number for validation
      required: [true, "Please insert course price"],
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

// Compile the schema into a model
const Course = mongoose.model("Course", courseSchema);

export default Course;
