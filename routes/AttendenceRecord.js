const { markAttendence, getAttendanceDetailsOfASection, getAttendanceAnalyticsForSection } = require("../controllers/AttendenceRecord");

const attendanceRecordRouter = require("express").Router();

attendanceRecordRouter
  .route("/markAttendence/:sectionId/:studentId")
  .post(markAttendence);

  attendanceRecordRouter.route('/attendanceOfASection/:sectionId').get(getAttendanceDetailsOfASection);
  attendanceRecordRouter.route('/attendanceAnalysisOfASection/:sectionId').get(getAttendanceAnalyticsForSection)

module.exports = attendanceRecordRouter;
