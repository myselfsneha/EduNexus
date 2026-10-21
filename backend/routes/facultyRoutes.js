
const express = require("express");
const router = express.Router();

const {
  getFaculty,
  getFacultyById,
  addFaculty,
  updateFaculty,
  deleteFaculty,
} = require("../controllers/facultyController");

// List and search faculty
router.get("/", getFaculty);

// Get one faculty member
router.get("/:id", getFacultyById);

// Add a faculty member
router.post("/", addFaculty);

// Update a faculty member
router.put("/:id", updateFaculty);

// Delete a faculty member
router.delete("/:id", deleteFaculty);

module.exports = router;
