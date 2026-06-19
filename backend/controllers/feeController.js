const db = require("../config/db");

exports.addFee = async (req, res) => {
  try {
    const {
      student_id,
      amount,
      status,
      payment_date,
    } = req.body;

    await db.query(
      `INSERT INTO fees
      (student_id, amount, status, payment_date)
      VALUES (?, ?, ?, ?)`,
      [
        student_id,
        amount,
        status,
        payment_date,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Fee record added",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.getFees = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM fees ORDER BY id DESC"
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