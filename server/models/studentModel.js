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
});

export default Student;
