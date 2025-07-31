const AttendenceRecord = require("../models/AttendenceRecord");
const Section = require("../models/Section");
const User = require("../models/User");
const AsyncWrap = require("../utils/asyncWrap");
const ExpressError = require("../utils/ExpressErrors");

const normalizeDate = (date) => {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0); // Set time to 00:00:00 UTC
  return d;
};
// mark attendance of student
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

// get the attendace of a complete section
exports.getAttendanceDetailsOfASection = AsyncWrap(async (req, res) => {
  const { sectionId } = req.params;
  const { date } = req.body;

  if (!sectionId || !date) {
    throw new ExpressError(400, "Section ID and Date are required!");
  }

  const normalizedDate = normalizeDate(date);

  const attendanceRecords = await AttendenceRecord.find({
    section: sectionId,
    date: normalizedDate,
  }).populate("student", "firstName lastName email");

  return res.status(200).json({
    success: true,
    message: "Attendance data for section retrieved successfully",
    data: attendanceRecords,
  });
});

// get the attendace of any student for a time period
exports.getStudentAttendance = AsyncWrap(async (req, res) => {
  const { studentId, sectionId } = req.params;
  // const { month, year } = req.query;
  const { startDate, endDate } = req.body;

  if (!startDate || !endDate) {
    throw new ExpressError(400, "Start and End date are required!");
  }

  const start = normalizeDate(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  const records = await AttendenceRecord.find({
    student: studentId,
    section: sectionId,

    date: { $gte: start, $lte: end },
  });

  // const matchQuery = { student: studentId };

  // if (month && year) {
  //   const start = new Date(year, month - 1, 1);
  //   const end = new Date(year, month, 0, 23, 59, 59);
  //   matchQuery.date = { $gte: start, $lte: end };
  // }

  // const records = await AttendenceRecord.find(matchQuery).populate("section");

  return res.status(200).json({
    success: true,
    message: "Student attendance fetched",
    data: records,
  });
});

// get the Attendace Percentage of any student for a time period
exports.getAttendancePercentageForStudent = AsyncWrap(async (req, res) => {
  const { studentId , sectionId} = req.params;

  const total = await AttendenceRecord.countDocuments({
    student: studentId,
    section: sectionId,
    $or: [{ status: "Present" }, { status: "Absent" }],
  });
  const present = await AttendenceRecord.countDocuments({
    student: studentId,
    status: "Present",
  });

  const percentage = total === 0 ? 0 : ((present / total) * 100).toFixed(2);

  return res.status(200).json({
    success: true,
    message: "Attendance percentage calculated",
    data: { total, present, percentage: `${percentage}%` },
  });
});

exports.getAbsentStudentsForDateInSection = AsyncWrap(async (req, res) => {
  const { sectionId } = req.params;
  const { date } = req.query;

  if (!date) {
    throw new ExpressError(400, "Date is required");
  }

  const normalizedDate = normalizeDate(date);

  const absentees = await AttendenceRecord.find({
    section: sectionId,
    date: normalizedDate,
    status: "Absent",
  }).populate("student", "firstName lastName email");

  return res.status(200).json({
    success: true,
    message: "Absent students fetched",
    data: absentees,
  });
});

// get the attendance analytics of a section
exports.getAttendanceAnalyticsForSection = AsyncWrap(async (req, res) => {
  const { sectionId } = req.params;
  const { startDate, endDate } = req.body;

  if (!startDate || !endDate) {
    throw new ExpressError(400, "Start and End date are required!");
  }

  const start = normalizeDate(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  const records = await AttendenceRecord.find({
    section: sectionId,
    date: { $gte: start, $lte: end },
  }).populate([
    {
      path: "student",
      select: ["firstName"],
    },
    {
      path: "section",
      select: ["sectionName"],
    },
  ]);

  const stats = {
    total: records.length,
    present: records.filter((r) => r.status === "Present").length,
    absent: records.filter((r) => r.status === "Absent").length,
    na: records.filter((r) => r.status === "N/A").length,
  };

  return res.status(200).json({
    success: true,
    message: "Section attendance analytics fetched",
    data: stats,
    attendanceRecords: records,
  });
});
