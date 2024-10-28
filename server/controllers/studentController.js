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
    console.log(req.body);
    const student = new Student(req.body);

    await student.save();
    res
      .status(200)
      .json({ message: "Student registered successfully", student });
  } catch (error) {
    //console.log(error);
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

export const updateStudent = async (req, res) => {
  try {
    const id = req.params.id;
    console.log("Id: ", id);
    const { name, phoneNumber, course, startDate, shift } = req.body;
    const student = await Student.update(
      { name, phoneNumber, course, startDate, shift },
      {
        where: { id: id },
      }
    );
    res.status(200).json({ message: "Student updated successfully", student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
