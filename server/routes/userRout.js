import express from "express";
import {
  signup,
  signin,
  getUserById,
  edditProfile,
  changePassword,
  confirmEmail,
} from "../controllers/authController.js";
import upload from "../config/multerConfig.js";

const router = express.Router();
// 1. User routes
router.route("/signup").post(signup);
router.route("/signin").post(signin);
router.route("/getuser/:userId").get(getUserById);
router.route("/updateProfile/:id").put(upload.single("image"), edditProfile);
router.route("/confirm-email/:token").get(confirmEmail);
router.route("/changepassword").put(changePassword);

export default router;
