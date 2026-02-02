require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

// conexão com o banco
require("./src/config/db");

const app = express();

app.use(cors());
app.use(express.json());

// ============================
// ROTAS DE TESTE
// ============================
app.get("/", (req, res) => {
  res.send("API ONLINE NO RENDER");
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// ============================
// IMPORTAR ROTAS
// ============================
const clientesRoutes = require("./src/routes/clientesRoutes");
const produtosRoutes = require("./src/routes/produtosRoutes");
const pedidosRoutes = require("./src/routes/pedidosRoutes");
const relatoriosRoutes = require("./src/routes/relatoriosRoutes");
const dashboardRoutes = require("./src/routes/dashboardRoutes");
const authRoutes = require("./src/routes/authRoutes");

// ============================
// MONTAR ROTAS DA API
// ============================
app.use("/api/clientes", clientesRoutes);
app.use("/api/produtos", produtosRoutes);
app.use("/api/pedidos", pedidosRoutes);
app.use("/api/relatorios", relatoriosRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/auth", authRoutes);

// ============================
// SERVIR FRONTEND
// ============================
app.use(express.static(path.join(__dirname, "frontend", "dist")));

app.get("/api", (req, res) => {
  res.send("API de vendas funcionando!");
});
app.get("/db-test", async (req, res) => {
  try {
    const mysql = require("mysql2/promise");

    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
      ssl: { rejectUnauthorized: true }
    });

    await conn.query("SELECT 1");
    res.json({ status: "CONECTADO COM SUCESSO AO AIVEN" });

  } catch (err) {
    res.status(500).json({
      status: "ERRO",
      error: err.message,
      code: err.code
    });
  }
});

// ============================
// ROTA CORINGA DO REACT
// ============================
app.get(/.*/, (req, res) => {
  res.sendFile(
    path.join(__dirname, "frontend", "dist", "index.html")
  );
});

// ============================
// INICIAR SERVIDOR
// ============================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
