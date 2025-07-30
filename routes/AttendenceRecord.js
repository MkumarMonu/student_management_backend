const { markAttendence } = require("../controllers/AttendenceRecord");

const attendanceRecordRouter = require("express").Router();

attendanceRecordRouter
  .route("/markAttendence/:sectionId/:studentId")
  .post(markAttendence);

module.exports = attendanceRecordRouter;
