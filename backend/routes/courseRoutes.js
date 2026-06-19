const express = require("express");
const router = express.Router();

const {
  addCourse,
  getCourses,
} = require("../controllers/courseController");

router.post("/", addCourse);
router.get("/", getCourses);

module.exports = router;