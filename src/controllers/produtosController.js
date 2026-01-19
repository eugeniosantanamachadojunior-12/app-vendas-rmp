const db = require("../config/db");

// ============================
// CRIAR PRODUTO
// ============================
exports.criarProduto = async (req, res) => {
  const { nome, preco, estoque } = req.body;

  if (!nome || preco == null || estoque == null) {
    return res.status(400).json({
      error: "Nome, preço e estoque são obrigatórios"
    });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO produtos (nome, preco, estoque) VALUES (?, ?, ?)",
      [nome, preco, estoque]
    );

    res.status(201).json({
      message: "Produto cadastrado com sucesso",
      id: result.insertId
    });
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    res.status(500).json({ error: error.message });
  }
};

// ============================
// LISTAR PRODUTOS
// ============================
exports.listarProdutos = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM produtos");
    res.json(rows);
  } catch (error) {
    console.error("Erro ao listar produtos:", error);
    res.status(500).json({ error: error.message });
  }
};

// ============================
// BUSCAR PRODUTO POR ID
// ============================
exports.buscarProdutoPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT * FROM produtos WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Erro ao buscar produto:", error);
    res.status(500).json({ error: error.message });
  }
};

// ============================
// ATUALIZAR PRODUTO
// ============================
exports.atualizarProduto = async (req, res) => {
  const { id } = req.params;
  const { nome, preco, estoque } = req.body;

  if (!nome || preco == null || estoque == null) {
    return res.status(400).json({
      error: "Nome, preço e estoque são obrigatórios"
    });
  }

  try {
    const [result] = await db.query(
      "UPDATE produtos SET nome = ?, preco = ?, estoque = ? WHERE id = ?",
      [nome, preco, estoque, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    res.json({ message: "Produto atualizado com sucesso" });
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    res.status(500).json({ error: error.message });
  }
};

// ============================
// DELETAR PRODUTO
// ============================
exports.deletarProduto = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query(
      "DELETE FROM produtos WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    res.json({ message: "Produto removido com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar produto:", error);
    res.status(500).json({ error: error.message });
  }
};
// ============================
// EXTRATO DE ESTOQUE DO PRODUTO
// ============================
exports.extratoEstoque = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(
      `
      SELECT
        m.data_mov,
        m.tipo,
        m.quantidade,
        m.origem,
        m.origem_id
      FROM movimentacoes_estoque m
      WHERE m.produto_id = ?
      ORDER BY m.data_mov DESC
      `,
      [id]
    );

    res.json(rows);
  } catch (error) {
    console.error("Erro extrato estoque:", error);
    res.status(500).json({ error: error.message });
  }
};
