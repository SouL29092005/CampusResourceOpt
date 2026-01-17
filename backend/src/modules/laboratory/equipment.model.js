import mongoose from "mongoose";

const equipmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String
    },

    labName: {
      type: String,
      required: true
    },

    equipmentNumber: {
        type: Number,
        required: true,
        unique: true
    },

    location: {
      type: String,
      required: false
    },

    maintainedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LabAdminProfile",
      required: true
    },

    status: {
      type: String,
      enum: ["available", "in-use", "maintenance"],
      default: "available"
    },

    maxBookingDurationDays: {
      type: Number,
      default: 3
    }
  },
  { timestamps: true }
);

export default mongoose.model("Equipment", equipmentSchema);
