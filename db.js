const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Mahesh@123",
  database: "auth_app",
});

module.exports = db;