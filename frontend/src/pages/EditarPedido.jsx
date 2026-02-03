import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function EditarPedido() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [itens, setItens] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [produtoId, setProdutoId] = useState("");
  const [quantidade, setQuantidade] = useState(1);

  useEffect(() => {
  api.get(`/pedidos/${id}/itens`).then(res => {
    setItens(Array.isArray(res.data) ? res.data : []);
  });

  api.get("/produtos").then(res => {
    setProdutos(Array.isArray(res.data) ? res.data : []);
  });
}, [id]);

function adicionar() {
  api.post(`/pedidos/${id}/itens`, { produto_id: produtoId, quantidade })
    .then(() => {
      api.get(`/pedidos/${id}/itens`).then(res => {
        setItens(Array.isArray(res.data) ? res.data : []);
      });
      setProdutoId("");
      setQuantidade(1);
    });
}


  function remover(itemId) {
    if (!confirm("Remover este item?")) return;
    api.delete(`/pedidos/${id}/itens/${itemId}`)
      .then(() => {
        setItens(itens.filter(i => i.id !== itemId));
      });
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Editar Pedido #{id}</h1>

      <div className="flex gap-2 mb-4">
        <select
          className="border p-2"
          value={produtoId}
          onChange={e => setProdutoId(e.target.value)}
        >
          <option value="">Selecione o produto</option>
          {produtos.map(p => (
            <option key={p.id} value={p.id}>{p.nome}</option>
          ))}
        </select>

        <input
          type="number"
          className="border p-2 w-24"
          value={quantidade}
          onChange={e => setQuantidade(e.target.value)}
        />

        <button
          onClick={adicionar}
          className="bg-blue-600 text-white px-4 rounded"
        >
          Adicionar
        </button>
      </div>

      {itens.map(i => (
        <div key={i.id} className="flex justify-between border p-2 mb-2">
          <span>{i.nome} (x{i.quantidade})</span>
          <button
            onClick={() => remover(i.id)}
            className="bg-red-600 text-white px-3"
          >
            Remover
          </button>
        </div>
      ))}

      <button
        onClick={() => navigate("/pedidos")}
        className="mt-6 bg-gray-600 text-white px-6 py-2"
      >
        Voltar
      </button>
    </div>
  );
}
