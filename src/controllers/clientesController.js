const db = require("../config/db");

// ============================
// CRIAR CLIENTE
// ============================
exports.criarCliente = async (req, res) => {
  const { nome, email, telefone, cpf_cnpj } = req.body;

  try {
    const [result] = await db.query(
      "INSERT INTO clientes (nome, email, telefone, cpf_cnpj) VALUES (?, ?, ?, ?)",
      [nome, email, telefone, cpf_cnpj]
    );

    res.json({ message: "Cliente criado", id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


// ============================
// LISTAR CLIENTES
// ============================
exports.listar = async (req, res) => {
  const [rows] = await db.query(
    "SELECT id, nome, telefone, email, cpf_cnpj FROM clientes ORDER BY nome"
  );
  res.json(rows);
};


// ============================
// BUSCAR CLIENTE POR ID
// ============================
exports.buscarClientePorId = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT * FROM clientes WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Cliente não encontrado" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Erro ao buscar cliente:", error);
    res.status(500).json({ error: error.message });
  }
};

// ============================
// ATUALIZAR CLIENTE
// ============================
exports.atualizarCliente = async (req, res) => {
  const { id } = req.params;
  const { nome, email, telefone, cpf_cnpj } = req.body;

  await db.query(
    "UPDATE clientes SET nome=?, email=?, telefone=?, cpf_cnpj=? WHERE id=?",
    [nome, email, telefone, cpf_cnpj, id]
  );

  res.json({ message: "Cliente atualizado" });
};

// ============================
// DELETAR CLIENTE
// ============================
exports.deletarCliente = async (req, res) => {
  const { id } = req.params;

  const [pedidos] = await db.query(
    "SELECT COUNT(*) AS total FROM pedidos WHERE cliente_id = ?",
    [id]
  );

  if (pedidos[0].total > 0) {
    return res.status(400).json({
      error: "Não é possível excluir cliente com vendas registradas"
    });
  }

  await db.query("DELETE FROM clientes WHERE id = ?", [id]);
  res.json({ message: "Cliente removido com sucesso" });
};
// ============================
// HISTÓRICO DE COMPRAS DO CLIENTE
// ============================
exports.historicoCompras = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(
      `
      SELECT 
        p.id AS pedido_id,
        p.created_at AS data,
        p.total,
        GROUP_CONCAT(
          CONCAT(pr.nome, ' x ', ip.quantidade)
          SEPARATOR ', '
        ) AS itens
      FROM pedidos p
      JOIN itens_pedido ip ON ip.pedido_id = p.id
      JOIN produtos pr ON pr.id = ip.produto_id
      WHERE p.cliente_id = ?
        AND p.status = 'CONFIRMADO'
      GROUP BY p.id
      ORDER BY p.created_at DESC
      `,
      [id]
    );

    res.json(rows);
  } catch (error) {
    console.error("Erro no histórico:", error);
    res.status(500).json({ error: error.message });
  }
};
