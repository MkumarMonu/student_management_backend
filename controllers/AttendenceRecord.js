const AttendenceRecord = require("../models/AttendenceRecord");
const Section = require("../models/Section");
const User = require("../models/User");
const AsyncWrap = require("../utils/asyncWrap");
const ExpressError = require("../utils/ExpressErrors");

const normalizeDate = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

exports.markAttendence = AsyncWrap(async (req, res) => {
  const { sectionId, studentId } = req.params;
  const { status, date } = req.body;

  if (!sectionId || !studentId || !status || !date) {
    throw new ExpressError(400, "All fields are requirred!");
  }

  const todayDate = normalizeDate(Date.now());
  const dateNormalized = normalizeDate(date);

  if (todayDate.getTime() !== dateNormalized.getTime()) {
    throw new ExpressError(
      400,
      "You can not mark the attendance of past or future date!"
    );
  }

  const userExistInSection = await User.findOne({
    section: sectionId,
    _id: studentId,
  });

  if (!userExistInSection) {
    throw new ExpressError(404, "Student not found in this section");
  }

  const alreadyMarked = await AttendenceRecord.findOne({
    $and: [{ student: studentId }, { date: dateNormalized }],
  });

  if (alreadyMarked) {
    if (alreadyMarked.status !== status) {
      alreadyMarked.status = status;
      await alreadyMarked.save();

      return res.status(200).json({
        success: true,
        message: "Attendance updated!",
        data: alreadyMarked,
      });
    }
    return res.status(200).json({
      success: true,
      message: "Attendance already marked with same status.",
      data: alreadyMarked,
    });
  }

  const markAttendance = await AttendenceRecord.create({
    student: studentId,
    section: sectionId,
    status,
    date: dateNormalized,
  });

  await User.findOneAndUpdate(
    { section: sectionId, _id: studentId },
    {
      $push: { attendenceRecord: markAttendance._id },
    },
    { new: true }
  );

  return res.status(201).json({
    success: true,
    message: "Attendence marked",
    date: markAttendance,
  });
});
