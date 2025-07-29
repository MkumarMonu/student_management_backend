let Class = require("../models/Class.js");
const AsyncWrap = require("../utils/asyncWrap.js");
const ExpressError = require("../utils/ExpressErrors.js");

exports.createClass = AsyncWrap(async (req, res) => {
  const { className, classTeacher } = req.body;

  if (!className) {
    return res
      .status(400)
      .json({ success: false, message: "class name is requirred!" });
  }

  const alreadyExist = await Class.findOne({ className });
  if (alreadyExist) {
    throw new ExpressError(400, "class already exist!");
  }

  const newClass = new Class({ className, classTeacher });
  const data = await newClass.save();
  if (!data) {
    throw new ExpressError(400, "class not added!");
  }
  return res
    .status(201)
    .json({ success: true, message: "class added successfully!", data });
});

exports.getClass = AsyncWrap(async (req, res) => {
  const data = await Class.find().populate("sections");
  if (!data?.data == []) {
    return res.status(400).json({ success: false, message: "No class found!" });
  }
  return res
    .status(200)
    .json({ success: true, message: "Class data fetched successfully!", data });
});

exports.deleteClass = AsyncWrap(async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Class.findByIdAndDelete({ _id: id });
    if (!data) {
      return res
        .status(400)
        .json({ success: false, message: "Class not found!" });
    }

    return res.status(200).json({
      success: true,
      message: "Class deleted successfully!",
      data,
    });
  } catch (error) {
    throw new ExpressError(400, "Internal Server Error");
  }
});
