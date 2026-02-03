import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function Vendas() {
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);

  const [clienteId, setClienteId] = useState("");
  const [produtoId, setProdutoId] = useState("");
  const [quantidade, setQuantidade] = useState(1);

  const [pedido, setPedido] = useState(null);
  const [itens, setItens] = useState([]);


 useEffect(() => {
  api.get("/clientes").then(r => setClientes(r.data || []));
  api.get("/produtos").then(r => setProdutos(r.data || []));
}, []);


  function abrirVenda() {
    if (!clienteId) return alert("Selecione um cliente");

api.post("/pedidos", {
  cliente_id: clienteId,
  itens: []
}).then(res => {
  setPedido({
    id: res.data.pedido_id,
    status: "ABERTO"
  });
  setItens([]);
});


  }
  function adicionarItem() {
    if (!produtoId || quantidade < 1) return;

    api.post(`/pedidos/${pedido.id}/itens`, {
      produto_id: produtoId,
      quantidade
    }).then(() => {
      carregarItens();
      setProdutoId("");
      setQuantidade(1);
    });
  }

function carregarItens() {
  api.get(`/pedidos/${pedido.id}/itens`)
    .then(r => {
      if (Array.isArray(r.data)) {
        setItens(r.data);
      } else {
        setItens([]);
      }
    })
    .catch(() => setItens([]));
}



function removerItem(itemId) {
  if (!pedido) return;

  api.delete(`/pedidos/${pedido.id}/itens/${itemId}`)
    .then(() => carregarItens())
    .catch(err => {
      console.error(err);
      alert("Erro ao remover item");
    });
}



  function alterarQuantidade(itemId, qtd) {
    api.put(`/pedidos/${pedido.id}/itens/${itemId}`, {
      quantidade: qtd
    }).then(() => carregarItens());
  }

  function cancelarVenda() {
    if (!window.confirm("Cancelar esta venda?")) return;

    api.put(`/pedidos/${pedido.id}/cancelar`).then(() => {
      alert("Venda cancelada");
      setPedido(null);
      setItens([]);
      setClienteId("");
    });
  }

  function finalizarVenda() {
    if (!window.confirm("Finalizar esta venda?")) return;

    api.put(`/pedidos/${pedido.id}/confirmar`).then(() => {
      alert("Venda finalizada!");
      setPedido(null);
      setItens([]);
      setClienteId("");
    });
  }

  const total = Array.isArray(itens)
  ? itens.reduce((s, i) => s + i.preco * i.quantidade, 0)
  : 0;


  function statusBadge() {
    if (!pedido) return null;

    const map = {
      ABERTO: "bg-blue-500",
      FINALIZADO: "bg-green-600",
      CANCELADO: "bg-red-600"
    };

    return (
      <span className={`px-4 py-1 rounded-full text-white text-sm ${map[pedido.status]}`}>
        {pedido.status}
      </span>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">

      <div className="bg-white p-4 rounded shadow flex items-center gap-4">
        <select
          className="flex-1 bg-gray-100 border p-3 rounded"
          value={clienteId}
          onChange={e => setClienteId(e.target.value)}
          disabled={pedido}
        >
          <option value="">Selecione o cliente</option>
         {Array.isArray(clientes) && clientes.map(c => (
  <option key={c.id} value={c.id}>{c.nome}</option>
))}

        </select>

        {!pedido && (
          <button onClick={abrirVenda} className="bg-green-600 text-white px-6 py-3 rounded">
            Iniciar venda
          </button>
        )}

        {pedido && statusBadge()}
      </div>

      {pedido && (
        <>
          <div className="bg-white p-4 mt-6 rounded shadow flex gap-4">
            <select
              className="flex-1 bg-gray-100 border p-3 rounded"
              value={produtoId}
              onChange={e => setProdutoId(e.target.value)}
            >
              <option value="">Selecione o produto</option>
              {Array.isArray(produtos) && produtos.map(p => (
  <option key={p.id} value={p.id}>{p.nome}</option>
))}

            </select>

            <input
              type="number"
              min="1"
              value={quantidade}
              onChange={e => setQuantidade(e.target.value)}
              className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-center font-bold text-gray-900 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
/>

            <button onClick={adicionarItem} className="bg-blue-600 text-white px-6 py-3 rounded">
              Adicionar
            </button>
          </div>

          <div className="bg-white p-4 mt-6 rounded shadow">
        {Array.isArray(itens) && itens.map(i => (

  <div
    key={i.id}
    className="flex items-center justify-between border-b py-3"
  >
    {/* Nome do produto */}
    <div className="flex-1 font-medium text-gray-800">
      {i.nome}
    </div>

    {/* Quantidade */}
    <div className="w-24 text-center">
      <input
        type="number"
        min="1"
        value={i.quantidade}
        onChange={e => alterarQuantidade(i.id, e.target.value)}
        className="w-full px-3 py-1 border rounded-lg text-center font-semibold text-gray-800 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    {/* Preço */}
<div className="w-32 text-right pr-6 text-lg font-bold text-gray-900">
  R$ {(i.preco * i.quantidade).toLocaleString("pt-BR", {
    minimumFractionDigits: 2
  })}
</div>

{/* Remover */}
<div className="w-28 text-right">
  <button
    onClick={() => removerItem(i.id)}
    className="
      px-4 py-2
      rounded-lg
      bg-red-600
      text-white
      font-semibold
      hover:bg-red-700
      active:scale-95
      transition
      shadow-md
    "
  >
    Remover
  </button>
</div>




  </div>
))}


            <div className="mt-8 flex justify-between items-center border-t pt-6">
  <span className="text-xl font-semibold text-gray-700">
    Total da Venda
  </span>

  <span className="text-4xl font-extrabold text-green-700 tracking-tight">
    R$ {total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
  </span>
</div>

          </div>

          <div className="flex gap-4 mt-6">
            <button onClick={finalizarVenda} className="flex-1 bg-green-700 text-white py-4 rounded">
              Finalizar venda
            </button>
            <button onClick={cancelarVenda} className="flex-1 bg-red-700 text-white py-4 rounded">
              Cancelar venda
            </button>
          </div>
        </>
      )}
    </div>
  );
}
