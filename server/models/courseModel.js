import { Sequelize, DataTypes, UUID, UUIDV4 } from "sequelize";

import { sequelize } from "../db.js";

const Course = sequelize.define("Course", {
  id: {
    type: UUID,
    defaultValue: UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Please insert course name" },
    },
  },
  duration: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Please insert course duration" },
    },
  },
  price: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Please insert course price" },
    },
  },
});

export default Course;
