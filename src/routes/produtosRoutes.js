const express = require("express");
const router = express.Router();
const produtosController = require("../controllers/produtosController");

console.log("📦 produtosRoutes.js carregado");

// ROTAS PADRÃO
router.post("/", produtosController.criarProduto);
router.get("/", produtosController.listarProdutos);
router.get("/:id", produtosController.buscarProdutoPorId);
router.put("/:id", produtosController.atualizarProduto);
router.delete("/:id", produtosController.deletarProduto);

// 🚀 LOTE (IMPORTANTE)
router.post("/lote", produtosController.criarProdutosLote);

module.exports = router;