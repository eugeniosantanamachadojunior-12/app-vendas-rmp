const fs = require("fs");
const path = require("path");
const mysql = require("mysql2");

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: {
    ca: fs.readFileSync(path.join(__dirname, "../../ca.pem")),
    rejectUnauthorized: false,
    checkServerIdentity: () => null
  }
});

module.exports = connection;
