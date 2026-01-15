import { createClassService } from "./timetable.service.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { createTimetable } from "./timetable.service.js";

export const createClass = async (req, res, next) => {
  try {
    const newClass = await createClassService(req.body);

    return res.status(201).json(
      new ApiResponse(201, newClass, "Class created successfully")
    );
  } catch (error) {
    next(error);
  }
};

export async function generateTimetableController(req, res, next) {
  try {
    const classroomCount = req.body;
    const rooms = Array.from({ length: classroomCount }, (_, i) => `C${i + 1}`);

    const timetable = await createTimetable({rooms });

    res.status(201).json({
      success: true,
      timetable,
    });
  } catch (err) {
    next(err);
  }
}