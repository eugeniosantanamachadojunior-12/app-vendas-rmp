const express = require("express");
const router = express.Router();
const pedidosController = require("../controllers/pedidosController");

// globais
router.put("/cancelar-todos", pedidosController.cancelarTodos);
router.delete("/limpar-tudo", pedidosController.limparTudo);

// padrão
router.get("/", pedidosController.listarPedidos);
router.get("/:id/itens", pedidosController.listarItensPedido);
router.post("/", pedidosController.criarPedido);
router.post("/:id/itens", pedidosController.adicionarItemPedido);
router.delete("/:id/itens/:itemId", pedidosController.removerItemPedido);
router.put("/:id/confirmar", pedidosController.confirmarPedido);
router.put("/:id/cancelar", pedidosController.cancelarPedido);

// 🔥 ESSA LINHA ESTAVA FALTANDO
router.delete("/:id", pedidosController.excluirPedido);

module.exports = router;
