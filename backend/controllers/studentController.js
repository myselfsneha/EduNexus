const db = require("../config/db");

// GET ALL STUDENTS
const getStudents = async (req, res) => {
  try {
    const [results] = await db.query(
      "SELECT * FROM students"
    );

    res.json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (err) {
    console.error("GET STUDENTS ERROR:", err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// ADD STUDENT
const addStudent = async (req, res) => {
  try {
    const { name, email, course, year, phone } =
      req.body;

    const sql = `
      INSERT INTO students
      (name, email, course, year, phone)
      VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [
      name,
      email,
      course,
      year,
      phone,
    ]);

    res.status(201).json({
      success: true,
      message: "Student added successfully",
      studentId: result.insertId,
    });
  } catch (err) {
    console.error("ADD STUDENT ERROR:", err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// DELETE STUDENT
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      "DELETE FROM students WHERE id = ?",
      [id]
    );

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
  } catch (err) {
    console.error("DELETE STUDENT ERROR:", err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// UPDATE STUDENT
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      course,
      year,
      phone,
    } = req.body;

    const sql = `
      UPDATE students
      SET name=?, email=?, course=?, year=?, phone=?
      WHERE id=?
    `;

    const [result] = await db.query(sql, [
      name,
      email,
      course,
      year,
      phone,
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.json({
      success: true,
      message: "Student updated successfully",
    });
  } catch (err) {
    console.error("UPDATE STUDENT ERROR:", err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

module.exports = {
  getStudents,
  addStudent,
  deleteStudent,
  updateStudent,
};