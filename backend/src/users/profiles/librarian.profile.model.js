import mongoose from "mongoose";

const librarianProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    libraryName: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("LibrarianProfile", librarianProfileSchema);
