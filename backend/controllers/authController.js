const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role = "student",
    } = req.body;

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    await db.query(
      "INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)",
      [name, email, hashedPassword, role]
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.login = async (req, res) => {
  console.log("LOGIN HIT");

  try {
    const { email, password } = req.body;

    console.log("EMAIL:", email);

    const [results] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    console.log(
      "USERS FOUND:",
      results.length
    );

    if (results.length === 0) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const user = results[0];

    console.log(
      "CHECKING PASSWORD FOR:",
      user.email
    );

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    console.log(
      "PASSWORD MATCH:",
      isMatch
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    console.log(
      "LOGIN SUCCESS:",
      user.email
    );

    res.json({
      success: true,
      token,
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const [results] = await db.query(
      "SELECT id, name, email, role, created_at FROM users WHERE id = ?",
      [req.user.id]
    );

    res.json({
      success: true,
      user: results[0],
    });
  } catch (error) {
    console.error("PROFILE ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};