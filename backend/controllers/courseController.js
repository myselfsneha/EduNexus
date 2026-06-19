const db = require("../config/db");

exports.addCourse = async (req, res) => {
  try {
    const { course_name, duration } = req.body;

    await db.query(
      "INSERT INTO courses (course_name, duration) VALUES (?, ?)",
      [course_name, duration]
    );

    res.status(201).json({
      success: true,
      message: "Course added",
    });
  } catch (error) {
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
      data: rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};