const express = require('express');
const router = express.Router();
const { sincronizarClientesML } = require('../controllers/mlController');

router.get('/sync-ml', async (req, res) => {
    await sincronizarClientesML();
    res.send('Clientes sincronizados!');
});

module.exports = router;