const express = require('express');
const router = express.Router();

const clientesController = require('../controllers/clientesController');

console.log('📦 clientesRoutes.js carregado');

// CREATE – criar cliente
router.post('/', clientesController.criarCliente);

// READ – listar todos os clientes
router.get('/', clientesController.listarClientes);

// READ – buscar cliente por ID
router.get('/:id', clientesController.buscarClientePorId);

// UPDATE – atualizar cliente
router.put('/:id', clientesController.atualizarCliente);

// DELETE – excluir cliente
router.delete('/:id', clientesController.deletarCliente);


module.exports = router;
