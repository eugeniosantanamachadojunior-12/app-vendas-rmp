const express = require("express");
const router = express.Router();
const clientesController = require("../controllers/clientesController");

// ⚠️ ROTAS ESPECIAIS PRIMEIRO
router.get("/:id/historico", clientesController.historicoCompras);

// CRUD normal
router.get("/", clientesController.listar);
router.post("/", clientesController.criarCliente);
router.get("/:id", clientesController.buscarClientePorId);
router.put("/:id", clientesController.atualizarCliente);
router.delete("/:id", clientesController.deletarCliente);

module.exports = router;
