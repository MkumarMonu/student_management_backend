const mongoose = require("mongoose");

const resultRecord = new mongoose.Schema({
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
  resultStatus: {
    type: String,
  },
});

module.exports = mongoose.model("ResultRecord", resultRecord);
