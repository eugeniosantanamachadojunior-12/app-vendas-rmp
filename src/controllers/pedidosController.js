const db = require("../config/db");

// ============================
// CRIAR PEDIDO
// ============================
exports.criarPedido = async (req, res) => {
  const { cliente_id } = req.body;
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [result] = await connection.query(
      "INSERT INTO pedidos (cliente_id, total, status) VALUES (?, 0, 'ABERTO')",
      [cliente_id]
    );

    await connection.commit();
    res.json({ pedido_id: result.insertId });

  } catch (error) {
    await connection.rollback();
    res.status(400).json({ error: error.message });
  } finally {
    connection.release();
  }
};

// ============================
// LISTAR PEDIDOS
// ============================
exports.listarPedidos = async (req, res) => {
  const [rows] = await db.query(`
    SELECT 
      p.id,
      p.data_pedido,
      p.total,
      p.status,
      c.nome AS cliente_nome
    FROM pedidos p
    JOIN clientes c ON c.id = p.cliente_id
    ORDER BY p.id DESC
  `);

  res.json(rows);
};

// ============================
// LISTAR ITENS DO PEDIDO
// ============================
exports.listarItensPedido = async (req, res) => {
  const { id } = req.params;

  const [rows] = await db.query(`
    SELECT ip.id, p.nome, p.preco, ip.quantidade
    FROM itens_pedido ip
    JOIN produtos p ON p.id = ip.produto_id
    WHERE ip.pedido_id = ?
  `, [id]);

  res.json(rows);
};

// ============================
// ADICIONAR ITEM
// ============================
exports.adicionarItemPedido = async (req, res) => {
  const { id } = req.params;
  const { produto_id, quantidade } = req.body;
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [[produto]] = await connection.query(
      "SELECT preco, estoque FROM produtos WHERE id = ? FOR UPDATE",
      [produto_id]
    );

    if (!produto || produto.estoque < quantidade) {
      throw new Error("Estoque insuficiente");
    }

    await connection.query(`
      INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unit)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE quantidade = quantidade + VALUES(quantidade)
    `, [id, produto_id, quantidade, produto.preco]);

    await connection.query(
      "UPDATE produtos SET estoque = estoque - ? WHERE id = ?",
      [quantidade, produto_id]
    );

    await connection.query(
      "UPDATE pedidos SET total = total + (? * ?) WHERE id = ?",
      [produto.preco, quantidade, id]
    );

    await connection.commit();
    res.json({ message: "Item adicionado" });

  } catch (error) {
    await connection.rollback();
    res.status(400).json({ error: error.message });
  } finally {
    connection.release();
  }
};

// ============================
// REMOVER ITEM
// ============================
exports.removerItemPedido = async (req, res) => {
  const { id, itemId } = req.params;
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [[item]] = await connection.query(
      "SELECT produto_id, quantidade, preco_unit FROM itens_pedido WHERE id = ? AND pedido_id = ?",
      [itemId, id]
    );

    if (!item) throw new Error("Item não encontrado");

    await connection.query(
      "UPDATE produtos SET estoque = estoque + ? WHERE id = ?",
      [item.quantidade, item.produto_id]
    );

    await connection.query(
      "DELETE FROM itens_pedido WHERE id = ?",
      [itemId]
    );

    await connection.query(
      "UPDATE pedidos SET total = total - (? * ?) WHERE id = ?",
      [item.preco_unit, item.quantidade, id]
    );

    await connection.commit();
    res.json({ message: "Item removido" });

  } catch (error) {
    await connection.rollback();
    res.status(400).json({ error: error.message });
  } finally {
    connection.release();
  }
};

// ============================
// CONFIRMAR PEDIDO
// ============================
exports.confirmarPedido = async (req, res) => {
  const { id } = req.params;
  await db.query("UPDATE pedidos SET status = 'FINALIZADO' WHERE id = ?", [id]);
  res.json({ message: "Pedido finalizado" });
};

// ============================
// CANCELAR PEDIDO
// ============================
exports.cancelarPedido = async (req, res) => {
  const { id } = req.params;
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [itens] = await connection.query(
      "SELECT produto_id, quantidade FROM itens_pedido WHERE pedido_id = ?",
      [id]
    );

    for (const item of itens) {
      await connection.query(
        "UPDATE produtos SET estoque = estoque + ? WHERE id = ?",
        [item.quantidade, item.produto_id]
      );
    }

    await connection.query(
      "UPDATE pedidos SET status = 'CANCELADO' WHERE id = ?",
      [id]
    );

    await connection.commit();
    res.json({ message: "Pedido cancelado" });

  } catch (error) {
    await connection.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
};

// ============================
// 🔥 CANCELAR TODOS OS PEDIDOS ABERTOS (DEVOLVE ESTOQUE)
// ============================
exports.cancelarTodos = async (req, res) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [pedidos] = await connection.query(
      "SELECT id FROM pedidos WHERE status = 'ABERTO'"
    );

    for (const pedido of pedidos) {
      const [itens] = await connection.query(
        "SELECT produto_id, quantidade FROM itens_pedido WHERE pedido_id = ?",
        [pedido.id]
      );

      for (const item of itens) {
        await connection.query(
          "UPDATE produtos SET estoque = estoque + ? WHERE id = ?",
          [item.quantidade, item.produto_id]
        );
      }

      await connection.query(
        "UPDATE pedidos SET status = 'CANCELADO' WHERE id = ?",
        [pedido.id]
      );
    }

    await connection.commit();
    res.json({ message: "Todos os pedidos abertos foram cancelados" });

  } catch (error) {
    await connection.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
};

// ============================
// 🔥 LIMPAR TUDO (NÃO DEVOLVE ESTOQUE)
// ============================
exports.limparTudo = async (req, res) => {
  await db.query("DELETE FROM itens_pedido");
  await db.query("DELETE FROM pedidos");
  res.json({ message: "Sistema limpo (estoque não alterado)" });
};
