const mongoose = require("mongoose");

// Define the Profile schema
const parentsDetailsSchema = new mongoose.Schema({
  fatherName: {
    type: String,
    required: true,
  },
  motherName: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: Number,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
});

// Export the Profile model
module.exports = mongoose.model("ParentsDetails", parentsDetailsSchema);
