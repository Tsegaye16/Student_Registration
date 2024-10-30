import Course from "../models/courseModel.js";
import { Op } from "sequelize";

export const addCourse = async (req, res) => {
  try {
    const course = new Course(req.body);

    await course.save();
    res.status(200).json({ message: "Course added successfully", course });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const getAllCourse = async (req, res) => {
  try {
    const courses = await Course.findAll();
    res.status(200).json({ message: "success", result: courses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const { ids } = req.body;
    // delete all course based on list of id
    const result = await Course.destroy({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    });

    res.status(200).json({ message: "success", result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const id = req.params.id;
    console.log("Id: ", id);
    const { name, price, duration } = req.body;
    const course = await Course.update(
      { name, price, duration },
      {
        where: { id: id },
      }
    );
    res.status(200).json({ message: "Course updated successfully", course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
