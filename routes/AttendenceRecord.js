const {
  markAttendence,
  getAttendanceDetailsOfASection,
  getAttendanceAnalyticsForSection,
  getStudentAttendance,
  getAttendancePercentageForStudent,
} = require("../controllers/AttendenceRecord");

const attendanceRecordRouter = require("express").Router();

// mark attendance of student
attendanceRecordRouter
  .route("/markAttendence/:sectionId/:studentId")
  .post(markAttendence);

// get the attendace of a complete section
attendanceRecordRouter
  .route("/attendanceOfASection/:sectionId")
  .get(getAttendanceDetailsOfASection);

// get the attendace of any student for a time period
attendanceRecordRouter
  .route("/attendanceOfAStudent/:sectionId/:studentId")
  .get(getStudentAttendance);

// get the Attendace Percentage of any student for a time period
attendanceRecordRouter
  .route("/attendancePercentageOfAStudent/:sectionId/:studentId")
  .get(getAttendancePercentageForStudent);

// get the attendance analytics of a section
attendanceRecordRouter
  .route("/attendanceAnalysisOfASection/:sectionId")
  .get(getAttendanceAnalyticsForSection);

module.exports = attendanceRecordRouter;
