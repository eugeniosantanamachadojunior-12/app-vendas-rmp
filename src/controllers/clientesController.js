const db = require("../config/db");

// ============================
// CRIAR CLIENTE
// ============================
exports.criarCliente = async (req, res) => {
  const { nome, email, telefone } = req.body;

  if (!nome || !email || !telefone) {
    return res.status(400).json({
      error: "Nome, email e telefone são obrigatórios"
    });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO clientes (nome, email, telefone) VALUES (?, ?, ?)",
      [nome, email, telefone]
    );

    res.status(201).json({
      message: "Cliente cadastrado com sucesso",
      id: result.insertId
    });
  } catch (error) {
    console.error("Erro ao inserir cliente:", error);
    res.status(500).json({ error: error.message });
  }
};

// ============================
// LISTAR CLIENTES
// ============================
exports.listarClientes = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM clientes");
    res.json(rows);
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    res.status(500).json({ error: error.message });
  }
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
  const { nome, email, telefone } = req.body;

  if (!nome || !email || !telefone) {
    return res.status(400).json({
      error: "Nome, email e telefone são obrigatórios"
    });
  }

  try {
    const [result] = await db.query(
      "UPDATE clientes SET nome = ?, email = ?, telefone = ? WHERE id = ?",
      [nome, email, telefone, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Cliente não encontrado" });
    }

    res.json({ message: "Cliente atualizado com sucesso" });
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error);
    res.status(500).json({ error: error.message });
  }
};

// ============================
// DELETAR CLIENTE
// ============================
exports.deletarCliente = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query(
      "DELETE FROM clientes WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Cliente não encontrado" });
    }

    res.json({ message: "Cliente removido com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar cliente:", error);
    res.status(500).json({ error: error.message });
  }
};
