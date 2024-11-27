import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true, // Removes leading/trailing whitespaces
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    course: {
      type: String,
      required: [true, "Course is required"],
      trim: true,
    },
    startDate: {
      type: Date, // Mongoose automatically supports date types
      default: null,
    },
    shift: {
      type: String,
      required: [true, "Shift is required"],
      enum: ["evening", "afternoon"], // Enforces specific values
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ["paid", "unpaid", "partially"], // Enforces specific values
      default: "unpaid",
    },
    amountPaid: {
      type: mongoose.Types.Decimal128, // MongoDB supports decimal types for precision
      required: true,
      default: 0.0,
    },
    attendance: {
      type: [
        {
          date: { type: String, required: true }, // Date as a string (e.g., "YYYY-MM-DD")
          status: { type: String, required: true, enum: ["present", "absent"] },
        },
      ],
      default: [], // Initialize as an empty array
    },
    examScores: {
      type: Map, // Use Map to store key-value pairs for flexibility
      of: Number, // Each score is a number
      default: {
        practiceExam: 0.0,
        writenExam: 0.0,
        exitExam: 0.0,
      },
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

// Compile the schema into a model
const Student = mongoose.model("Student", studentSchema);

export default Student;
