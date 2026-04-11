const db = require("../config/db");

// ============================
// CRIAR EM LOTE (ÚNICA VERSÃO)
// ============================
exports.criarProdutosLote = async (req, res) => {
  try {
    const produtos = req.body;

    if (!Array.isArray(produtos)) {
      return res.status(400).json({ erro: "Formato inválido. Envie um array." });
    }

    for (const p of produtos) {
      const nome = p.nome?.trim();
      const preco = Number(p.preco);
      const estoque = Number(p.estoque);

      if (!nome || isNaN(preco) || isNaN(estoque)) {
        console.log("Produto inválido ignorado:", p);
        continue;
      }

      await db.query(
        "INSERT INTO produtos (nome, preco, estoque, ativo) VALUES (?, ?, ?, 1)",
        [nome, preco, estoque]
      );
    }

    res.json({ mensagem: "Produtos inseridos com sucesso 🚀" });

  } catch (err) {
    console.error("ERRO LOTE:", err);
    res.status(500).json({ erro: err.message });
  }
};

// ============================
// LISTAR
// ============================
exports.listarProdutos = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM produtos WHERE ativo = 1");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ============================
// BUSCAR POR ID
// ============================
exports.buscarProdutoPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT * FROM produtos WHERE id = ? AND ativo = 1",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ============================
// ATUALIZAR
// ============================
exports.atualizarProduto = async (req, res) => {
  const { id } = req.params;
  const { nome, preco, estoque } = req.body;

  try {
    const [atual] = await db.query(
      "SELECT nome, preco, estoque FROM produtos WHERE id = ?",
      [id]
    );

    if (atual.length === 0) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    const novoNome = nome || atual[0].nome;
    const novoPreco = preco !== undefined ? preco : atual[0].preco;
    const novoEstoque = estoque !== undefined ? estoque : atual[0].estoque;

    await db.query(
      "UPDATE produtos SET nome=?, preco=?, estoque=? WHERE id=?",
      [novoNome, novoPreco, novoEstoque, id]
    );

    res.json({ message: "Produto atualizado com sucesso" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ============================
// EXCLUIR
// ============================
exports.deletarProduto = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query(
      "UPDATE produtos SET ativo = 0 WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    res.json({ message: "Produto desativado com sucesso" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ============================
// EXTRATO
// ============================
exports.extratoEstoque = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT data_mov, tipo, quantidade, origem, origem_id 
       FROM movimentacoes_estoque 
       WHERE produto_id = ? 
       ORDER BY data_mov DESC`,
      [id]
    );

    res.json(rows);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};