import Course from "../models/courseModel.js"; // Import your Mongoose Course model

export const addCourse = async (req, res) => {
  try {
    const course = new Course(req.body);

    // Save the course to the database
    await course.save();

    res.status(200).json({ message: "Course added successfully", course });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getAllCourse = async (req, res) => {
  try {
    // Fetch all courses from the database
    const courses = await Course.find();

    res.status(200).json({ message: "success", result: courses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const { ids } = req.body;

    // Delete courses with matching IDs
    const result = await Course.deleteMany({
      _id: { $in: ids },
    });

    res.status(200).json({ message: "Courses deleted successfully", result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, price, duration } = req.body;

    // Find and update the course by ID
    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      { name, price, duration },
      { new: true, runValidators: true } // Return the updated document and validate input
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res
      .status(200)
      .json({ message: "Course updated successfully", course: updatedCourse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
