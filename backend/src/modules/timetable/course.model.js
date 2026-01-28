import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    courseCode: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },

    courseName: {
      type: String,
      required: true,
      trim: true,
    },

    weeklyHours: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },

    type: {
      type: String,
      enum: ["LECTURE", "LAB", "TUTORIAL"],
      default: "LECTURE",
    },
  },
  {
    timestamps: true,
  }
);

export const CourseModel = mongoose.model("Course", courseSchema);