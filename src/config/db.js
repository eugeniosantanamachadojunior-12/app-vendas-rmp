const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  // ESTA LINHA É O QUE RESOLVE O ERRO 500 NA AIVEN:
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = pool;
