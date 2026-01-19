// conexão com o banco
require("./src/config/db");

const express = require("express");
const cors = require("cors");

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

console.log("🚀 Registrando rotas");

// ============================
// MONTAR ROTAS NO EXPRESS
// ============================
app.use("/clientes", clientesRoutes);
app.use("/produtos", produtosRoutes);
app.use("/pedidos", pedidosRoutes);
app.use("/relatorios", relatoriosRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/auth", authRoutes);

// rota raiz
app.get("/", (req, res) => {
  res.send("API de vendas funcionando!");
});

// ============================
// INICIAR SERVIDOR (SEMPRE POR ÚLTIMO)
// ============================
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});
