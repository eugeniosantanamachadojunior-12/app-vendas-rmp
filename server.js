console.log("TLS:", process.env.NODE_TLS_REJECT_UNAUTHORIZED);
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const mlRoutes = require('./src/routes/mlRoutes');
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
app.use('/api', mlRoutes);

// ============================
// SERVIR FRONTEND
// ============================
app.use(express.static(path.join(__dirname, "frontend", "dist")));

app.get("/api", (req, res) => {
  res.send("API de vendas funcionando!");
});
const pool = require("./src/config/db");

app.get("/db-test", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1");
    res.json({ status: "OK", rows });
  } catch (err) {
    res.json({
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
