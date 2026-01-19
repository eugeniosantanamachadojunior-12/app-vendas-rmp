const express = require('express');
const router = express.Router();

const pedidosController = require('../controllers/pedidosController');

console.log('📦 pedidosRoutes.js carregado');

// CREATE
router.post('/', pedidosController.criarPedido);

// READ
router.get('/', pedidosController.listarPedidos);
router.get('/:id', pedidosController.buscarPedidoPorId);

// UPDATE (status)
router.put('/:id/status', pedidosController.atualizarStatusPedido);

// DELETE
router.delete('/:id', pedidosController.cancelarPedido);

module.exports = router;
