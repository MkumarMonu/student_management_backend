const mongoose = require("mongoose");

// Define the Section schema
const sectionSchema = new mongoose.Schema({
  sectionName: {
    type: String,
    required: true,
    default: "A",
  },
  sectionDescription: {
    type: String,
    required: true,
  },
  classRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true,
  },
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  timeTable: [{ type: mongoose.Schema.Types.ObjectId, ref: "Timetable" }],
  attendenceRecord: [
    { type: mongoose.Schema.Types.ObjectId, ref: "AttendenceRecord" },
  ],
  resultRecord: [{ type: mongoose.Schema.Types.ObjectId, ref: "ResultData" }],
});

// Export the Section model
module.exports = mongoose.model("Section", sectionSchema);
