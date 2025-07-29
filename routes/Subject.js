const { addSubject } = require('../controllers/Subject');

const subjectRouter = require('express').Router();

subjectRouter.route('/:sectionId').post(addSubject)

module.exports = subjectRouter;