const express = require("express");
const router = express.Router();

const {
  getStudents,
  addStudent,
  deleteStudent,
} = require("../controllers/studentController");

router.get("/", getStudents);
router.post("/", addStudent);
router.delete("/:id", deleteStudent);

module.exports = router;