import mongoose from "mongoose";

const librarianProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    qualification: {
      type: String,
      required: false
    },

    librarySection: {
      type: String,
      required: false
    }
  },
  { timestamps: true }
);

export default mongoose.model("LibrarianProfile", librarianProfileSchema);
