const sectionRouter = require("express").Router();
const {
  createSection,
  getAllSectionByClassId,
  updateSection,
} = require("../controllers/Section");

sectionRouter
  .route("/:classId")
  .post(createSection)
  .get(getAllSectionByClassId);

sectionRouter.route("/:sectionId").put(updateSection);

module.exports = sectionRouter;
