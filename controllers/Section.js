const Section = require("../models/Section");
const Course = require("../models/Course");
const SubSection = require("../models/SubSection");
const ExpressError = require("../utils/ExpressErrors");
const AsyncWrap = require("../utils/asyncWrap");
const Class = require("../models/Class");
const { populate } = require("../models/User");

// CREATE a new section
exports.createSection = AsyncWrap(async (req, res) => {
  const { classId } = req.params;
  const { sectionName, sectionDescription } = req.body;

  // Validate the input
  if (!sectionName || !sectionDescription) {
    throw new ExpressError(400, "All fields are required");
  }

  const existClass = await Class.findOne({ _id: classId });
  if (!existClass) throw new ExpressError(400, "Class not found!");

  const alreadyExist = await Section.findOne({
    $and: [{ classRef: classId, sectionName }],
  });

  if (alreadyExist) {
    throw new ExpressError(400, `${sectionName} is already exist!`);
  }
  // Create a new section with the given name
  const newSection = await Section.create({
    sectionName,
    sectionDescription,
    classRef: classId,
  });

   await existClass.updateOne({
    $push: { sections: newSection._id },
  });


  // Return the updated course object in the response
  res.status(200).json({
    success: true,
    message: "Section created successfully!",
    data: newSection,
  });
});

exports.getAllSectionByClassId = AsyncWrap(async (req, res) => {
  const { classId } = req.params;
  const sections = await Class.findOne({ _id: classId }).populate({
    path: "sections",
    populate: [
      { path: "subjects" },
      { path: "students", select: "firstName lastName email rollNumber" },
    ],
  });

  if (!sections) {
    throw new ExpressError(400, "No Class or Section Found!");
  }
  return res.status(200).json({
    success: true,
    message: "Sections fetched successfully!",
    data: sections,
  });
});

// UPDATE a section
exports.updateSection = AsyncWrap(async (req, res) => {
  const { sectionId } = req.params;
  const { sectionName, sectionDescription } = req.body;
  // Validate the input
  if (!sectionName || !sectionDescription) {
    throw new ExpressError(400, "All fields are required");
  }
  // Find the section to update
  const existSection = await Section.findOne({ _id: sectionId });

  if (!existSection) throw new ExpressError(400, "Section not found!");
  // Update the section with the given name and description
  const updatedSection = await existSection.updateOne({
    $set: {
      sectionName,
      sectionDescription,
    },
  });

  console.log("section update from section controller :", updatedSection);
  res.status(200).json({
    success: true,
    message: "Section updated successfully!",
    data: updatedSection,
  });
});

// DELETE a section
exports.deleteSection = async (req, res) => {
  try {
    const { sectionId } = req.params;
    await Course.findByIdAndUpdate(courseId, {
      $pull: {
        courseContent: sectionId,
      },
    });
    const section = await Section.findById(sectionId);
    console.log(sectionId, courseId);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not Found",
      });
    }

    //delete sub section
    await SubSection.deleteMany({ _id: { $in: section.subSection } });

    await Section.findByIdAndDelete(sectionId);

    //find the updated course and return
    const course = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    res.status(200).json({
      success: true,
      message: "Section deleted",
      data: course,
    });
  } catch (error) {
    console.error("Error deleting section:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
