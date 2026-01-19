const db = require("../config/db");

// ============================
// RELATÓRIO DE VENDAS POR PERÍODO
// ============================
exports.relatorioVendas = async (req, res) => {
  const { inicio, fim } = req.query;

  if (!inicio || !fim) {
    return res.status(400).json({
      error: "Informe as datas inicio e fim (YYYY-MM-DD)"
    });
  }

  try {
    const [rows] = await db.query(
  `
  SELECT
    DATE(p.data_pedido) AS data,
    COUNT(p.id) AS total_pedidos,
    SUM(p.total) AS total_vendido
  FROM pedidos p
  WHERE p.status = 'CONFIRMADO'
    AND DATE(p.data_pedido) BETWEEN ? AND ?
  GROUP BY DATE(p.data_pedido)
  ORDER BY data;
  `,
  [inicio, fim]
    );

    res.json(rows);
  } catch (error) {
    console.error("Erro relatório vendas:", error);
    res.status(500).json({ error: error.message });
  }
};
