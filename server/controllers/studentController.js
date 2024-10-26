import { Op } from "sequelize";
import Student from "../models/studentModel.js";
export const getAllStudent = async (req, res) => {
  try {
    const students = await Student.findAll();
    res.status(200).json({ message: "successfull", result: students });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addStudent = async (req, res) => {
  try {
    const student = new Student(req.body);

    await student.save();
    res
      .status(200)
      .json({ message: "Student registered successfully", student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const { ids } = req.body;
    // delete all course based on list of id
    const result = await Student.destroy({
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
