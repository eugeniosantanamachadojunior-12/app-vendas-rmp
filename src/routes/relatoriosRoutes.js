const express = require("express");
const router = express.Router();
const relatoriosController = require("../controllers/relatoriosController");

router.get("/vendas", relatoriosController.relatorioVendas);

module.exports = router;
