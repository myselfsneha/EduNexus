const db = require("../config/db");

// GET ALL STUDENTS
const getStudents = (req, res) => {
  const sql = "SELECT * FROM students";

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }

    res.json({
      success: true,
      count: results.length,
      data: results,
    });
  });
};

// ADD STUDENT
const addStudent = (req, res) => {
  const { name, email, course, year, phone } = req.body;

  const sql =
    "INSERT INTO students (name, email, course, year, phone) VALUES (?, ?, ?, ?, ?)";

  db.query(
    sql,
    [name, email, course, year, phone],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: err.message,
        });
      }

      res.status(201).json({
        success: true,
        message: "Student added successfully",
        studentId: result.insertId,
      });
    }
  );
};

// DELETE STUDENT
const deleteStudent = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM students WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.json({
      success: true,
      message: "Student deleted successfully",
    });
  });
};

module.exports = {
  getStudents,
  addStudent,
  deleteStudent,
};