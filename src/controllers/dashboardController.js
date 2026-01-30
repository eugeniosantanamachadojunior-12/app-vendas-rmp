const db = require("../config/db");

// ============================
// RESUMO EXECUTIVO (KPIs)
// ============================
exports.resumo = async (req, res) => {
  try {
    const [[faturamento]] = await db.query(`
      SELECT IFNULL(SUM(total),0) AS total
      FROM pedidos
      WHERE status = 'CONFIRMADO'
    `);

    const [[pedidos]] = await db.query(`
      SELECT COUNT(*) AS total
      FROM pedidos
      WHERE status = 'CONFIRMADO'
    `);

    const [[produtos]] = await db.query(`
      SELECT COUNT(*) AS total FROM produtos
    `);

    res.json({
      faturamento_total: faturamento.total,
      total_pedidos: pedidos.total,
      total_produtos: produtos.total
    });

  } catch (error) {
    console.error("Erro dashboard resumo:", error);
    res.status(500).json({ error: error.message });
  }
};

// ============================
// GRÁFICO DE VENDAS DIÁRIAS
// ============================
exports.vendasDiarias = async (req, res) => {
  try {
   const [rows] = await db.query
 
(`
      SELECT
        DATE(data_pedido) AS data,
        SUM(total) AS total_vendido
      FROM pedidos
      WHERE status = 'CONFIRMADO'
      GROUP BY DATE(data_pedido)
      ORDER BY data
    `);

   res.json(rows)
 ;
  } catch (error) {
    console.error("Erro vendasDiarias:", error);
    res.status(500).json({ error: error.message });
  }
};

// ============================
// TOP PRODUTOS MAIS VENDIDOS
// ============================
exports.topProdutos = async (req, res) => {
  try {
  const [rows] = await db.query
  
(`
      SELECT
        pr.nome,
        SUM(ip.quantidade) AS total_vendido
      FROM itens_pedido ip
      JOIN pedidos p ON p.id = ip.pedido_id
      JOIN produtos pr ON pr.id = ip.produto_id
      WHERE p.status = 'CONFIRMADO'
      GROUP BY pr.id
      ORDER BY total_vendido DESC
      LIMIT 5
    `);

   res.json(rows);
  } catch (error) {
    console.error("Erro topProdutos:", error);
    res.status(500).json({ error: error.message });
  }
};
