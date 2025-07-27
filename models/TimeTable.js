const mongoose = require("mongoose");

const timeTableSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
  },
  subjectName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
  },
  teacherName: {
    type: String,
    required: true,
    trim: true,
  },
  timing: {
    type: Number,
    require: true,
  },
});

module.export = mongoose.model("TimeTable", timeTableSchema);
