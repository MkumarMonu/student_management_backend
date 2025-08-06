const TimeTable = require("../models/TimeTable");
const AsyncWrap = require("../utils/asyncWrap");
const ExpressError = require("../utils/ExpressErrors");

exports.addTimeTable = AsyncWrap(async (req, res) => {
  const { sectionId, subjectId } = req.params;
  let { day, teacherName, startPeriod, endPeriod } = req.body;

  if (
    !sectionId ||
    !subjectId ||
    !day ||
    !teacherName ||
    !startPeriod ||
    !endPeriod
  ) {
    throw new ExpressError(400, "All fields are requirred!");
  }
  startPeriod = parseInt(startPeriod);
  endPeriod = parseInt(endPeriod);

  let existTimeTableforDay = await TimeTable.findOne({
    day,
    section: sectionId,
  });
  const newPeriod = {
    teacherName,
    startPeriod,
    endPeriod,
    subject: subjectId,
  };

  if (existTimeTableforDay) {
    existTimeTableforDay.periods.push(newPeriod);
    await existTimeTableforDay.save();
  } else {
    existTimeTableforDay = await TimeTable.create({
      day,
      section: sectionId,
      periods: [newPeriod],
    });
  }

  return res.status(201).json({
    success: true,
    message: `Time table for ${day} added successfully`,
    data: existTimeTableforDay,
  });
});

exports.getTimeTableBySection = AsyncWrap(async (req, res) => {
  const { sectionId } = req.params;

  if (!sectionId) {
    throw new ExpressError(400, "Section ID is required");
  }

  const timeTable = await TimeTable.find({ section: sectionId })
    .populate("periods.subject", "subjectName")
    .sort({ day: 1 });

  if (!timeTable || timeTable.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No timetable found for this section",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Timetable fetched successfully",
    data: timeTable,
  });
});

exports.updateTimeTablePeriod = AsyncWrap(async (req, res) => {
  const { sectionId, subjectId, periodId } = req.params;
  let { teacherName, day, startPeriod, endPeriod } = req.body;

  if (!teacherName || !subjectId || !startPeriod || !endPeriod) {
    throw new ExpressError(400, "All fields are required");
  }

  startPeriod = parseInt(startPeriod);
  endPeriod = parseInt(endPeriod);

  const timeTable = await TimeTable.findOne({ section: sectionId, day });

  if (!timeTable) {
    throw new ExpressError(404, "Timetable for this day not found");
  }

  const periodIndex = timeTable.periods.findIndex(
    (p) => p._id.toString() === periodId
  );

  if (periodIndex === -1) {
    throw new ExpressError(404, "Period not found in timetable");
  }

  // Update the period
  timeTable.periods[periodIndex] = {
    ...timeTable.periods[periodIndex]._doc,
    teacherName,
    subject: subjectId,
    startPeriod,
    endPeriod,
  };

  await timeTable.save();

  return res.status(200).json({
    success: true,
    message: "Period updated successfully",
    data: timeTable,
  });
});

exports.deletePeriodFromTimeTable = AsyncWrap(async (req, res) => {
  const { sectionId, day, periodId } = req.params;
  if (!sectionId || !day || !periodId) {
    throw new ExpressError(400, "All fields are required.");
  }

  const timeTable = await TimeTable.findOne({ section: sectionId, day });

  if (!timeTable) {
    throw new ExpressError(
      404,
      "TimeTable not found for the given day and section."
    );
  }

  const initialLength = timeTable.periods.length;

  timeTable.periods = timeTable.periods.filter(
    (period) => period._id.toString() !== periodId
  );

  // Check if any period was actually removed
  if (timeTable.periods.length === initialLength) {
    throw new ExpressError(404, "Period not found in timetable.");
  }

  await timeTable.save();

  return res.status(200).json({
    success: true,
    message: "Period deleted successfully.",
    data: timeTable,
  });
});
