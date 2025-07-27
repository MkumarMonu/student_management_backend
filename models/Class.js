const mongoose = require("mongoose");

// Define the Class schema
const classSchema = new mongoose.Schema(
  {
    className: { type: String, required: true, trim: true },
    classTeacher: { type: String, trim: true },
    sections: [{ type: mongoose.Schema.Types.ObjectId, ref: "Section" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Class", classSchema);
