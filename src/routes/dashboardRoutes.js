const authMiddleware = require("../middlewares/authMiddleware");

const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");

console.log("📊 dashboardRoutes.js carregado");

// KPIs PRINCIPAIS
router.get("/resumo", authMiddleware, dashboardController.resumo);

// GRÁFICO DE VENDAS DIÁRIAS
router.get("/vendas-diarias", authMiddleware, dashboardController.vendasDiarias);

// GRÁFICO TOP PRODUTOS
router.get("/top-produtos", authMiddleware, dashboardController.topProdutos);

module.exports = router;
