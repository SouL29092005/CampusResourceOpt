import mongoose from "mongoose";

const timetableEntrySchema = new mongoose.Schema(
  {
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },

    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    facultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    room: {
      type: String,
      required: true,
    },

    slot: {
      type: String,
      required: true, // e.g. MON_10
    },
  },
  { _id: false }
);

const timetableSchema = new mongoose.Schema(
  {
    entries: {
      type: [timetableEntrySchema],
      required: true,
    },

    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Timetable", timetableSchema);
