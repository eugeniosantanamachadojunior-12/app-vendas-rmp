const db = require("../config/db");

// ============================
// CRIAR PEDIDO COM BAIXA DE ESTOQUE (TRANSAÇÃO)
// ============================
exports.criarPedido = async (req, res) => {
  const { cliente_id, itens } = req.body;
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Criar pedido pendente
    const [pedidoResult] = await connection.query(
      "INSERT INTO pedidos (cliente_id, total, status) VALUES (?, 0, 'PENDENTE')",
      [cliente_id]
    );

    const pedidoId = pedidoResult.insertId;
    let totalPedido = 0;

    // 2. Processar itens
    for (const item of itens) {
      const { produto_id, quantidade } = item;

      // Bloquear produto
      const [produtoRows] = await connection.query(
        "SELECT id, preco, estoque FROM produtos WHERE id = ? FOR UPDATE",
        [produto_id]
      );

      if (produtoRows.length === 0) {
        throw new Error(`Produto ${produto_id} não encontrado`);
      }

      const produto = produtoRows[0];

      // Validar estoque
      if (produto.estoque < quantidade) {
        throw new Error(`Estoque insuficiente para o produto ${produto_id}`);
      }

      // Inserir item
      await connection.query(
        `INSERT INTO itens_pedido
         (pedido_id, produto_id, quantidade, preco_unit)
         VALUES (?, ?, ?, ?)`,
        [pedidoId, produto_id, quantidade, produto.preco]
      );

      // Baixar estoque
      await connection.query(
        "UPDATE produtos SET estoque = estoque - ? WHERE id = ?",
        [quantidade, produto_id]
      );
// 2.5 REGISTRAR MOVIMENTAÇÃO (SAÍDA)
await connection.query(
  `INSERT INTO movimentacoes_estoque
   (produto_id, tipo, quantidade, origem, origem_id)
   VALUES (?, 'SAIDA', ?, 'PEDIDO', ?)`,
  [produto_id, quantidade, pedidoId]
);

      totalPedido += produto.preco * quantidade;
    }

    // 3. Atualizar total
    await connection.query(
      "UPDATE pedidos SET total = ? WHERE id = ?",
      [totalPedido, pedidoId]
    );

    // 4. Confirmar pedido
    await connection.query(
      "UPDATE pedidos SET status = 'CONFIRMADO' WHERE id = ?",
      [pedidoId]
    );

    await connection.commit();

    res.status(201).json({
      message: "Pedido criado com sucesso",
      pedido_id: pedidoId,
      total: totalPedido
    });

  } catch (error) {
    await connection.rollback();
    res.status(400).json({ error: error.message });
  } finally {
    connection.release();
  }
};

// ============================
// LISTAR TODOS OS PEDIDOS
// ============================
exports.listarPedidos = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM pedidos");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ============================
// BUSCAR PEDIDO POR ID
// ============================
exports.buscarPedidoPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT * FROM pedidos WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Pedido não encontrado" });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ============================
// ATUALIZAR STATUS DO PEDIDO
// ============================
exports.atualizarStatusPedido = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await db.query(
      "UPDATE pedidos SET status = ? WHERE id = ?",
      [status, id]
    );

    res.json({ message: "Status atualizado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ============================
// DELETAR PEDIDO
// ============================
exports.cancelarPedido = async (req, res) => {
  const { id } = req.params;
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Bloquear pedido
    const [pedidoRows] = await connection.query(
      "SELECT status FROM pedidos WHERE id = ? FOR UPDATE",
      [id]
    );

    if (pedidoRows.length === 0) {
      throw new Error("Pedido não encontrado");
    }

    const pedido = pedidoRows[0];

    if (pedido.status !== "CONFIRMADO") {
      throw new Error("Somente pedidos CONFIRMADOS podem ser cancelados");
    }

    // 2. Buscar itens do pedido
    const [itens] = await connection.query(
      "SELECT produto_id, quantidade FROM itens_pedido WHERE pedido_id = ?",
      [id]
    );

  // 3. Devolver estoque e registrar movimentação
for (const item of itens) {
  // Devolver estoque
  await connection.query(
    "UPDATE produtos SET estoque = estoque + ? WHERE id = ?",
    [item.quantidade, item.produto_id]
  );

  // Registrar movimentação (ENTRADA)
  await connection.query(
    `INSERT INTO movimentacoes_estoque
     (produto_id, tipo, quantidade, origem, origem_id)
     VALUES (?, 'ENTRADA', ?, 'CANCELAMENTO', ?)`,
    [item.produto_id, item.quantidade, id]
  );
}


    // 4. Atualizar status
    await connection.query(
      "UPDATE pedidos SET status = 'CANCELADO' WHERE id = ?",
      [id]
    );

    await connection.commit();

    res.json({ message: "Pedido cancelado e estoque devolvido com sucesso" });

  } catch (error) {
    await connection.rollback();
    res.status(400).json({ error: error.message });
  } finally {
    connection.release();
  }
};