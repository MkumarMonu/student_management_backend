const mongoose = require("mongoose");

const periodSchema = new mongoose.Schema({
  startPeriod: {
    type: Number,
    required: true,
    min: 1,
    max: 12,
  },
  endPeriod: {
    type: Number,
    required: true,
    min: 1,
    max: 12,
    validate: {
      validator: function (v) {
        return v >= this.startPeriod;
      },
      message: "endPeriod must be greater than or equal to startPeriod",
    },
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  teacherName: {
    type: String,
    required: true,
    trim: true,
  },
});

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
  section: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Section",
  },
  periods: [periodSchema],
});

module.exports = mongoose.model("TimeTable", timeTableSchema);
