const { createClass, getClass, deleteClass } = require("../controllers/class");

const classRouter = require("express").Router();

classRouter.route("/").post(createClass).get(getClass);

classRouter.route("/:id").delete(deleteClass);
module.exports = classRouter;
