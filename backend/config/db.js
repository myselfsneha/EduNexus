require("dotenv").config();

const mysql = require("mysql2");

console.log("HOST =", process.env.DB_HOST);
console.log("PORT =", process.env.DB_PORT);
console.log("USER =", process.env.DB_USER);
console.log("PASS =", JSON.stringify(process.env.DB_PASSWORD));
console.log("DB =", process.env.DB_NAME);

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false,
  },
});

connection.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }

  console.log("MySQL Connected");
});

module.exports = connection;