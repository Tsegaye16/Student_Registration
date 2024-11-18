import { Sequelize, DataTypes, UUID, UUIDV4 } from "sequelize";
import bcrypt from "bcryptjs";
import { sequelize } from "../db.js";

const Student = sequelize.define("Student", {
  id: {
    type: UUID,
    primaryKey: true,
    defaultValue: UUIDV4,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msge: "Name is required" },
    },
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msge: "Phone number is required" },
    },
  },
  course: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msge: "Course is required" },
    },
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  shift: {
    type: DataTypes.ENUM("evening", "afternoon"),
    allowNull: false,
    validate: {
      notEmpty: { msge: "Shift is required" },
    },
  },
  paymentStatus: {
    type: DataTypes.ENUM("paid", "unpaid", "partially"),
    allowNull: false,
    defaultValue: "unpaid",
  },
  amountPaid: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.0,
  },
  attendance: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [], // Initialize as an empty array
  },
  examScores: {
    type: DataTypes.JSONB, // Use JSONB for better query performance in PostgreSQL
    allowNull: false,
    defaultValue: {
      practiceExam: 0.0,
      writenExam: 0.0,
      exitExam: 0.0,
    },
  },
});

export default Student;
