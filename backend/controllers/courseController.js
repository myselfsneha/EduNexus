const db = require("../config/db");

exports.addCourse = async (req, res) => {
  try {
    const { name, description } = req.body;

    const [result] = await db.query(
      "INSERT INTO courses (name, description) VALUES (?, ?)",
      [name, description]
    );

    res.status(201).json({
      success: true,
      message: "Course added successfully",
      courseId: result.insertId,
    });
  } catch (error) {
    console.error("ADD COURSE ERROR:", error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.getCourses = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM courses ORDER BY id DESC"
    );

    res.json({
      success: true,
      count: rows.length,
      data: rows,
    });
  } catch (error) {
    console.error("GET COURSES ERROR:", error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};