const db = require("../config/db");

// ============================
// CRIAR
// ============================
exports.criarProduto = async (req, res) => {
  const { nome, preco, estoque } = req.body;

  if (!nome || preco == null || estoque == null) {
    return res.status(400).json({ error: "Dados obrigatórios: nome, preco, estoque" });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO produtos (nome, preco, estoque, ativo) VALUES (?, ?, ?, 1)",
      [nome, preco, estoque]
    );

    res.status(201).json({ message: "Produto criado", id: result.insertId });
  } catch (error) {
    console.error("Erro ao criar:", error);
    res.status(500).json({ error: "Erro interno ao criar produto" });
  }
};

// ============================
// LISTAR (somente ativos)
// ============================
exports.listarProdutos = async (req, res) => {
  try {
    // Adicione "WHERE ativo = 1" para não trazer produtos desativados
    const [rows] = await db.query

("SELECT * FROM produtos WHERE ativo = 1");
    res.json(rows)
;
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// ============================
// BUSCAR POR ID (Corrigido com Try/Catch)
// ============================
exports.buscarProdutoPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query

y("SELECT * FROM produtos WHERE id = ? AND ativo = 1", [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: "Produto não encontrado ou inativo" });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ============================
// ATUALIZAR (Melhorado para evitar sobrescrever com nulos)
// ============================
exports.atualizarProduto = async (req, res) => {
  const { id } = req.params;
  const { nome, preco, estoque } = req.body;

  try {
    // Primeiro verifica se o produto existe
    const [atual] = await db.query("SELECT nome, preco, estoque FROM produtos WHERE id = ?", [id]);
    if (atual.length === 0) return res.status(404).json({ error: "Produto não encontrado" });

    // Usa os valores antigos caso os novos não sejam enviados (Coalesce lógica)
    const novoNome = nome || atual[0].nome;
    const novoPreco = preco !== undefined ? preco : atual[0].preco;
    const novoEstoque = estoque !== undefined ? estoque : atual[0].estoque;

    const [result] = await db.query(
      "UPDATE produtos SET nome=?, preco=?, estoque=? WHERE id=?",
      [novoNome, novoPreco, novoEstoque, id]
    );

    res.json({ message: "Produto atualizado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ============================
// EXCLUIR (SOFT DELETE)
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
    console.error("Erro ao desativar produto:", error);
    res.status(500).json({ error: error.message });
  }
};

// ============================
// EXTRATO
// ============================
exports.extratoEstoque = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query

(
      `SELECT data_mov, tipo, quantidade, origem, origem_id 
       FROM movimentacoes_estoque 
       WHERE produto_id = ? 
       ORDER BY data_mov DESC`,
      [id]
    );

   res.json(rows)
 ;
  } catch (error) {
    console.error("Erro extrato estoque:", error);
    res.status(500).json({ error: error.message });
  }
};
exports.criarProdutosLote = async (req, res) => {
  const produtos = req.body;

  try {
    for (const p of produtos) {
      await db.execute(
        'INSERT INTO produtos (nome, preco, estoque) VALUES (?, ?, ?)',
        [p.nome, p.preco, p.estoque]
      );
    }

    res.json({ mensagem: 'Produtos inseridos com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao inserir produtos' });
  }
};