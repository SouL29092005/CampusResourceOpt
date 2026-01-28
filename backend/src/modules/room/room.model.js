import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    location: {
      type: String,
      required: true,
      trim: true
    },

    roomType: {
      type: String,
      enum: ["classroom", "laboratory", "seminar_hall", "auditorium"],
      required: true
    },

    capacity: {
      type: Number,
      required: true,
      min: 1
    },

    facilities: [
      {
        type: String
      }
    ],

    department: {
      type: String,
      trim: true
    },

    isActive: {
      type: Boolean,
      default: true
    },

    isBookable: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const Room = mongoose.model("Room", roomSchema);

export default Room;
