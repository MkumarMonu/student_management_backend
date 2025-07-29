const Section = require("../models/Section");
const Subject = require("../models/Subject");
const AsyncWrap = require("../utils/asyncWrap");
const ExpressError = require("../utils/ExpressErrors");

exports.addSubject = AsyncWrap(async (req, res) => {
  const { sectionId } = req.params;
  const { subjectName, subjectDescription } = req.body;

  if (!sectionId || !subjectName || !subjectDescription) {
    throw new ExpressError(400, "All fields are required!");
  }

  const alreadyExist = await Subject.findOne({
    $and: [{ section: sectionId, subjectName }],
  });

  if (alreadyExist) {
    throw new ExpressError(400, "Subject name already exist in this section!");
  }

  const createdSubject = await Subject.create({
    section: sectionId,
    subjectName,
    subjectDescription,
  });

  let result = await Section.findByIdAndUpdate(sectionId, {
    subjects: createdSubject._id,
  });
  console.log(result);
  return res
    .status(201)
    .json({
      success: true,
      message: `${subjectName}, added successfully!`,
      data: createdSubject,
    });
});
