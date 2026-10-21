
const express = require("express");
const router = express.Router();

const {
  getOptions,
  getTimetables,
  addTimetable,
  updateTimetable,
  deleteTimetable,
  addSubject,
  addClassroom,
} = require("../controllers/timetableController");

router.get("/options", getOptions);
router.get("/", getTimetables);
router.post("/", addTimetable);
router.put("/:id", updateTimetable);
router.delete("/:id", deleteTimetable);
router.post("/subjects", addSubject);
router.post("/classrooms", addClassroom);

module.exports = router;
