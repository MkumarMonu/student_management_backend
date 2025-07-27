const { createClass, getClass } = require("../controllers/class");

const classRouter = require("express").Router();

classRouter.route("/").post(createClass).get(getClass);

module.exports = classRouter;
