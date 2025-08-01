const {
  addTimeTable,
  getTimeTableBySection,
  updateTimeTablePeriod,
} = require("../controllers/TimeTable");

const timeTableRouter = require("express").Router();

timeTableRouter.route("/:sectionId/:subjectId").post(addTimeTable);
timeTableRouter.route("/:sectionId").get(getTimeTableBySection);
timeTableRouter
  .route("/:sectionId/:subjectId/:periodId")
  .put(updateTimeTablePeriod);

module.exports = timeTableRouter;
