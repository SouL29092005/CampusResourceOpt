import mongoose from "mongoose";

const timetableEntrySchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true
    },

    roomType: {
      type: String,
      required: true
    },

    dayOfWeek: {
      type: String,
      required: true
      // Example: Monday, Tuesday
    },

    startTime: {
      type: String,
      required: true
      // Example: "09:00"
    },

    endTime: {
      type: String,
      required: true
      // Example: "10:00"
    },

    courseCode: {
      type: String,
      required: true
    },

    courseName: {
      type: String,
      required: true
    },

    facultyName: {
      type: String,
      required: true
    },

    department: {
      type: String,
      required: true
    },

    semester: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

const TimetableEntry = mongoose.model(
  "TimetableEntry",
  timetableEntrySchema
);

export default TimetableEntry;
