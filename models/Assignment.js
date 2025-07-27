const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true,
  },
  section: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Section",
    required: true,
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },

  assignmentStatus: {
    type: String,
    enum: ["completed", "notCompleted"],
    default: "notCompleted",
  },
});

module.exports = mongoose.model("Assignment", assignmentSchema);
