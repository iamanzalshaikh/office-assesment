import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String, // Corrected type
    },
  },
  { timestamps: true }
);

export default mongoose.model("Department", departmentSchema);
