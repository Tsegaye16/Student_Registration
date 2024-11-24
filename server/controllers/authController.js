import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import User from "../models/userModel.js";
import mongoose from "mongoose";

const transporter = nodemailer.createTransport({
  service: "gmail", // You can use any email service provider (e.g., SendGrid, Mailgun)
  auth: {
    user: process.env.MY_EMAIL, // Your email address
    pass: process.env.EMAIL_PASSWORD, // Your email password (use environment variables in production)
  },
});

export const signup = async (req, res) => {
  try {
    const tokenExpirationTime = process.env.TOKEN_EXPIRATION_TIME || "1h"; // Default to 1 hour
    const { name, email, password } = req.body;

    // Check if a user with the given email already exists
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      // If the user exists but hasn't confirmed their email
      if (!oldUser.isConfirmed) {
        const currentTime = Date.now();
        const createdAtTime = new Date(oldUser.createdAt).getTime(); // Get the user's creation time

        // Check if the token (based on creation time) has expired
        if (currentTime - createdAtTime < 60 * 60 * 1000) {
          // 1 hour in milliseconds
          return res.status(400).json({
            message:
              "A confirmation email has already been sent. Please check your inbox and confirm your email.",
          });
        }

        // Generate a new token if the old one has expired
        const token = jwt.sign(
          { email: oldUser.email, id: oldUser._id },
          process.env.JWT_SECRET,
          {
            expiresIn: tokenExpirationTime, // Token valid for 1 hour
          }
        );

        const confirmationUrl = `http://localhost:3000/confirm-email?token=${token}`;

        await transporter.sendMail({
          from: process.env.MY_EMAIL,
          to: email,
          subject: "Email Confirmation",
          html: `<h1>Confirm your Email</h1>
                 <p>Your previous confirmation token has expired. Please click on the link below to confirm your email:</p>
                 <a href="${confirmationUrl}">Confirm Email</a>`,
        });

        return res.status(400).json({
          message:
            "The previous confirmation token has expired. A new email has been sent.",
        });
      }

      return res
        .status(400)
        .json({ message: "User already exists and is confirmed." });
    }

    // Create new user if no existing user with the email
    const token = jwt.sign({ email, id: name }, process.env.JWT_SECRET, {
      expiresIn: tokenExpirationTime,
    });

    const newUser = await User.create({
      email,
      password,
      name,
      isConfirmed: false, // Default to false until email is confirmed
    });

    const confirmationUrl = `https://foresizen.netlify.app/confirm-email?token=${token}`;

    await transporter.sendMail({
      from: process.env.MY_EMAIL,
      to: email,
      subject: "Email Confirmation",
      html: `<h1>Confirm your Email</h1>
             <p>Please click on the link below to confirm your email:</p>
             <a href="${confirmationUrl}">Confirm Email</a>`,
    });

    res.status(201).json({
      message: "You have successfully registered. Please confirm your email.",
      result: newUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const confirmEmail = async (req, res) => {
  const token = req.params.token;

  try {
    // Verify the token
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by email
    const existingUser = await User.findOne({ email: decodedData.email });

    if (!existingUser) {
      return res.status(400).json({ message: "Invalid confirmation link" });
    }

    // Check if the user is already confirmed
    if (existingUser.isConfirmed) {
      return res
        .status(400)
        .json({ message: "Email has already been confirmed." });
    }

    // Mark the user as confirmed
    existingUser.isConfirmed = true;
    await existingUser.save();

    res.status(200).json({ message: "Email confirmed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const oldUser = await User.findOne({ email });

    if (!oldUser) {
      return res.status(404).json({ message: "User doesn't exist" });
    }

    // Compare the entered password with the hashed password in the database
    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if the user's email is confirmed
    if (!oldUser.isConfirmed) {
      return res.status(400).json({ message: "Email is not verified" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { email: oldUser.email, id: oldUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Successfully logged in!",
      token,
      user: oldUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const id = req.params.userId;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "success", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const edditProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const id = req.params.id;
    const image = req.file?.filename; // Assuming image is uploaded and handled by a middleware
    console.log("ID: ", id);
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // 1. Fetch the user by ID
    const user = await User.findById(id);

    // 2. If user does not exist, return error
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 3. Update the user fields
    user.name = name || user.name;
    user.email = email || user.email;
    user.image = image || user.image;

    // 4. Save the updated user
    const updatedUser = await user.save();

    // 5. Return the updated user
    res
      .status(200)
      .json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, email } = req.body;

    // 1. Fetch the user based on email
    const user = await User.findOne({ email });

    // 2. If user does not exist, return error
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 3. Check if the current password is correct
    const isValidPassword = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid current password" });
    }

    // 4. Hash the new password and update it
    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    // 5. Return success response
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating password" });
  }
};
