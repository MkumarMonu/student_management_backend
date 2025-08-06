const mongoose = require("mongoose");

const markSchema = new mongoose.Schema({
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  score: {
    type: Number,
    required: true,
    min: 0,
  },
  maxMarks: {
    type: Number,
    required: true,
  },
});

const resultRecordSchema = new mongoose.Schema(
  {
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
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resultStatus: {
      type: String,
      enum: ["Pass", "Fail", "Pending"],
      default: "Pending",
    },
    marks: [markSchema], 
    overallPercentage: {
      type: Number,
      min: 0,
      max: 100,
    },
    grade: {
      type: String,
    },
    remarks: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ResultRecord", resultRecordSchema);
