import Student from "../models/studentModel";

export const getAllStudent = async (req, res) => {
  try {
    const students = await Student.findAll();
    res.status(200).json({ message: "successfull", result: students });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
