import mongoose from "mongoose";

const suggestionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    type: { type: String, required: true },
  },
  { timestamps: true }
);

const Suggestion = mongoose.model("suggestion", suggestionSchema);

export default Suggestion;
