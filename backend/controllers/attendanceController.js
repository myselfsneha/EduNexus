const db = require("../config/db");

exports.markAttendance = async (req, res) => {
  try {
    const { student_id, attendance_date, status } = req.body;

    const sql =
      "INSERT INTO attendance (student_id, attendance_date, status) VALUES (?, ?, ?)";

    await db.query(sql, [
      student_id,
      attendance_date,
      status,
    ]);

    res.status(201).json({
      success: true,
      message: "Attendance marked",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.getAttendance = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM attendance ORDER BY attendance_date DESC"
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