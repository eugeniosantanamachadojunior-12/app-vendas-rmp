const express = require('express');
const router = express.Router();

const produtosController = require('../controllers/produtosController');

console.log('📦 produtosRoutes.js carregado');

// CREATE
router.post('/', produtosController.criarProduto);

// READ
router.get('/', produtosController.listarProdutos);
router.get('/:id', produtosController.buscarProdutoPorId);

// UPDATE
router.put('/:id', produtosController.atualizarProduto);

// DELETE
router.delete('/:id', produtosController.deletarProduto);

module.exports = router;
// EXTRATO DE ESTOQUE DO PRODUTO
router.get("/:id/extrato", produtosController.extratoEstoque);
