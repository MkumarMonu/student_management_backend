const {
  addTimeTable,
  getTimeTableBySection,
  updateTimeTablePeriod,
  deletePeriodFromTimeTable,
} = require("../controllers/TimeTable");

const timeTableRouter = require("express").Router();

timeTableRouter.route("/:sectionId/:subjectId").post(addTimeTable);
timeTableRouter.route("/:sectionId").get(getTimeTableBySection);
timeTableRouter
  .route("/:sectionId/:subjectId/:periodId")
  .put(updateTimeTablePeriod);
timeTableRouter
  .route("/:sectionId/:periodId/:day")
  .delete(deletePeriodFromTimeTable);

module.exports = timeTableRouter;
