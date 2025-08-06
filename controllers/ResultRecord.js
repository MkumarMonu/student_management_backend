const ResultRecord = require("../models/ResultRecord");
const Section = require("../models/Section");
const User = require("../models/User");
const Subject = require("../models/Subject");
const AsyncWrap = require("../utils/asyncWrap"); // optional wrapper for error handling
const ExpressError = require("../utils/ExpressErrors"); // custom error class

// Utility to calculate percentage
const calculateOverallPercentage = (marks) => {
  const totalScore = marks.reduce((acc, mark) => acc + mark.score, 0);
  const totalMax = marks.reduce((acc, mark) => acc + mark.maxMarks, 0);
  return totalMax ? (totalScore / totalMax) * 100 : 0;
};

// Utility to determine grade
const determineGrade = (percentage) => {
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B";
  if (percentage >= 60) return "C";
  if (percentage >= 50) return "D";
  return "F";
};

// Utility to determine pass/fail
const determineStatus = (percentage) => {
  return percentage >= 33 ? "Pass" : "Fail";
};

// Create new result record
exports.addResultRecord = AsyncWrap(async (req, res) => {
  const { section, student, marks, remarks } = req.body;

  // Validation
  if (!section || !student || !Array.isArray(marks) || marks.length === 0) {
    throw new ExpressError(400, "Section, student, and marks are required");
  }

  // Validate referenced models
  const sectionExists = await Section.exists({ _id: section });
  const studentExists = await User.exists({ _id: student });
  if (!sectionExists || !studentExists) {
    throw new ExpressError(404, "Section or Student not found");
  }

  for (const mark of marks) {
    const subjectExists = await Subject.exists({ _id: mark.subject });
    if (!subjectExists) {
      throw new ExpressError(404, `Subject not found: ${mark.subject}`);
    }
    if (mark.score > mark.maxMarks) {
      throw new ExpressError(400, `Score cannot exceed maxMarks for subject ${mark.subject}`);
    }
  }

  const overallPercentage = calculateOverallPercentage(marks);
  const grade = determineGrade(overallPercentage);
  const resultStatus = determineStatus(overallPercentage);

  const resultRecord = new ResultRecord({
    section,
    student,
    marks,
    overallPercentage: overallPercentage.toFixed(2),
    grade,
    resultStatus,
    remarks,
  });

  await resultRecord.save();

  res.status(201).json({
    success: true,
    message: "Result record added successfully",
    data: resultRecord,
  });
});
