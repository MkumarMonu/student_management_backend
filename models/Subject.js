const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  subjectName: {
    type: String,
    unique:true,
    require: true,
    trim: true,
  },
  subjectDescription: {
    type: String,
    require: true,
    trim: true,
  },
  section: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Section",
  },
  syllabusCompletionPercentage: {
    type: String,
  },
});

module.exports = mongoose.model("Subject", subjectSchema);
