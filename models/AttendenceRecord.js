const mongoose = require("mongoose");

const attendenceRecordSchema = new mongoose.Schema({
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
  attendenceStatus: {
    type: String,
    enum: ["Present", "Absent"],
  },
  Date:{
   type:Date,
   required:true
  },
   Month:{
   type:Date,
   required:true
  },
   Year:{
   type:Date,
   required:true
  }
});

module.exports = mongoose.model("AttendenceRecord", attendenceRecordSchema);
