import { CourseModel } from "./course.model.js";

export const createCourse = async (req, res) => {
  try {
    const { courseCode, courseName, weeklyHours, type } = req.body;

    if (!courseCode || !courseName || !weeklyHours) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const course = await CourseModel.create({
      courseCode,
      courseName,
      weeklyHours,
      type,
    });

    return res.status(201).json({
      success: true,
      data: course,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all courses
export const getAllCourses = async (req, res) => {
  try {
    const courses = await CourseModel.find().sort({ courseCode: 1 });

    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single course by ID
export const getCourseById = async (req, res) => {
  try {
    const course = await CourseModel.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update course
export const updateCourse = async (req, res) => {
  try {
    const course = await CourseModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete course
export const deleteCourse = async (req, res) => {
  try {
    const course = await CourseModel.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
