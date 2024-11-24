import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please tell us your name!"], // Required with a custom error message
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide a valid email"], // Required with a custom error message
      unique: true,
      lowercase: true,
      validate: {
        validator: function (val) {
          // Use a regex for email validation
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
        },
        message: "Please provide a valid email",
      },
    },
    isConfirmed: {
      type: Boolean,
      default: false, // By default, the user is not confirmed
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [6, "Password must be at least 8 characters long"], // Add minimum length validation
    },
    image: {
      type: String, // URL for the image, optional
    },
  },
  {
    timestamps: true, // Automatically add `createdAt` and `updatedAt` fields
  }
);

// Middleware to hash the password before saving
userSchema.pre("save", async function (next) {
  // Only hash the password if it is new or has been modified
  if (!this.isModified("password")) return next();

  // Hash the password with cost factor 12
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Instance method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Compile the schema into a model
const User = mongoose.model("User", userSchema);

export default User;
