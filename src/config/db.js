const mysql = require('mysql2/promise');

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  ssl: {
    rejectUnauthorized: false
  }
});

// TESTE DE CONEXÃO
(async () => {
  try {
    const conn = await connection.getConnection();
    console.log("✅ Banco conectado com sucesso!");
    conn.release();
  } catch (error) {
    console.error("❌ ERRO AO CONECTAR NO BANCO:", error);
  }
})();

module.exports = connection;