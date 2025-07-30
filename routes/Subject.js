const { addSubject, getSubjectBySectionId } = require('../controllers/Subject');

const subjectRouter = require('express').Router();

subjectRouter.route('/:sectionId').post(addSubject).get(getSubjectBySectionId)

module.exports = subjectRouter;