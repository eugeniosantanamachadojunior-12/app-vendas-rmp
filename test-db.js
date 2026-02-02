const mysql = require("mysql2");

const conn = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: true }
});

conn.connect(err => {
  if (err) {
    console.error("ERRO DE CONEXÃO:", err);
  } else {
    console.log("CONECTADO COM SUCESSO AO AIVEN");
  }
});
