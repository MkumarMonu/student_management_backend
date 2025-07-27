const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  subjectName: {
    type: String,
    require: true,
    trim: true,
  },
  subjectDescription: {
    type: String,
    require: true,
    trim: true,
  },
  syllabusCompletionPercentage: {
    type: String,
  },
});

module.exports = mongoose.model("Subject", subjectSchema);
