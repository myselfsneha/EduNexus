require("dotenv").config();
require("./config/db");

const express = require("express");
const cors = require("cors");

const db = require("./config/db");

const healthRoutes = require("./routes/healthRoutes");
const studentRoutes = require("./routes/studentRoutes");
const authRoutes = require("./routes/authRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const feeRoutes = require("./routes/feeRoutes");
const courseRoutes = require("./routes/courseRoutes");

const authMiddleware = require("./middleware/authMiddleware");
const adminMiddleware = require("./middleware/adminMiddleware");

const app = express();

/* Middleware */
app.use(cors());
app.use(express.json());

/* Routes */
app.use("/health", healthRoutes);
app.use("/auth", authRoutes);
app.use("/students", studentRoutes);
app.use("/attendance", attendanceRoutes);
app.use("/fees", feeRoutes);
app.use("/courses", courseRoutes);

/* Root */
app.get("/", (req, res) => {
  res.send("EduNexus API Running");
});

/* Profile Route */
app.get("/profile", authMiddleware, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

/* Admin Route */
app.get(
  "/admin",
  authMiddleware,
  adminMiddleware,
  (req, res) => {
    res.json({
      success: true,
      message: "Welcome Admin",
    });
  }
);

/* Database Test */
app.get("/test-db", async (req, res) => {
  try {
    const [results] = await db.query(
      "SELECT 1 + 1 AS result"
    );

    res.json({
      success: true,
      data: results,
    });
  } catch (err) {
    console.error("TEST DB ERROR:", err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

/* Server */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 EduNexus Server running on port ${PORT}`
  );
});