require("dotenv").config();
// conexão com o banco
require("./src/config/db");

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

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
// SERVIR FRONTEND (VITE BUILD)
// ============================
app.use(express.static(path.join(__dirname, "frontend", "dist")));

app.get("/api", (req, res) => {
  res.send("API de vendas funcionando!");
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
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});
