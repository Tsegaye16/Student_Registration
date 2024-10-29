import express from "express";
import {
  signup,
  signin,
  getUserById,
  edditProfile,
  changePassword,
  confirmEmail,
} from "../controllers/authController.js";
import {
  addCourse,
  getAllCourse,
  deleteCourse,
  updateCourse,
} from "../controllers/courseController.js";
import {
  getAllStudent,
  addStudent,
  deleteStudent,
  updateStudent,
  markAttendance,
} from "../controllers/studentController.js";
import upload from "../config/multerConfig.js";

const router = express.Router();
// 1. User routes
router.route("/signup").post(signup);
router.route("/signin").post(signin);
router.route("/getuser/:userId").get(getUserById);
router.route("/updateProfile/:id").put(upload.single("image"), edditProfile);
router.route("/confirm-email/:token").get(confirmEmail);
router.route("/changepassword").put(changePassword);

// Course route
router.route("/addCourse").post(addCourse);
router.route("/getAllCourse").get(getAllCourse);
router.route("/deleteCourse").delete(deleteCourse);
router.route("/updateCourse/:id").put(updateCourse);

// Student route

router.route("/addStudent").post(addStudent);
router.route("/getAllStudent").get(getAllStudent);
router.route("/deleteStudent").delete(deleteStudent);
router.route("/updateStudent/:id").put(updateStudent);
router.route("/markAttendance").put(markAttendance);

export default router;
