require("dotenv").config();
require("./config/db");
const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const healthRoutes = require("./routes/healthRoutes");
const studentRoutes = require("./routes/studentRoutes");


const app = express();

app.use(cors());
app.use(express.json());
app.use("/health", healthRoutes);
app.use("/students", studentRoutes);

app.get("/", (req, res) => {
  res.send("EduNexus API Running");
});

app.get("/test-db", (req, res) => {
  db.query("SELECT 1 + 1 AS result", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(results);
  });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "EduNexus API is healthy"
  });
});