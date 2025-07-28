const sectionRouter = require("express").Router();
const {
  createSection,
  getAllSectionByClassId,
} = require("../controllers/Section");

sectionRouter
  .route("/:classId")
  .post(createSection)
  .get(getAllSectionByClassId);

module.exports = sectionRouter;
