import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const navigate = useNavigate();

function carregar() {
  api.get("/pedidos").then(res => {
    setPedidos(res.data.rows || []);
  });
}


  useEffect(() => {
    carregar();
  }, []);

  function editarPedido(id) {
    navigate(`/pedidos/${id}`);
  }

  function confirmarPedido(id) {
    if (!window.confirm("Confirmar este pedido? Após isso ele não poderá ser editado.")) return;

    api.put(`/pedidos/${id}/confirmar`)
      .then(() => {
        alert("Pedido confirmado!");
        carregar();
      })
      .catch(err => {
        alert("Erro ao confirmar pedido");
        console.error(err);
      });
  }

  function cancelarPedido(id) {
    if (!window.confirm("Deseja realmente cancelar este pedido?")) return;

    api.put(`/pedidos/${id}/cancelar`)
      .then(() => {
        alert("Pedido cancelado!");
        carregar();
      })
      .catch(err => {
        alert("Erro ao cancelar pedido");
        console.error(err);
      });
  }

  // Função para excluir pedido (usada tanto para ABERTO quanto para CANCELADO)
  function excluirPedido(id) {
    if (!window.confirm("Excluir este pedido permanentemente? Isso devolverá os itens ao estoque.")) return;

    api.delete(`/pedidos/${id}`)
      .then(() => {
        alert("Pedido excluído!");
        carregar();
      })
      .catch(err => {
        alert(err.response?.data?.error || "Erro ao excluir pedido");
        console.error(err);
      });
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Pedidos</h1>
      <div className="flex gap-4 mb-6">
  <button
    onClick={() => {
      if (!window.confirm("Cancelar TODOS os pedidos abertos e devolver o estoque?")) return;

      api.put("/pedidos/cancelar-todos")
        .then(() => {
          alert("Todos os pedidos abertos foram cancelados!");
          carregar();
        })
        .catch(err => {
          alert("Erro ao cancelar todos");
          console.error(err);
        });
    }}
    className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-bold shadow"
  >
    Cancelar TODOS (devolve estoque)
  </button>

  <button
    onClick={() => {
      if (!window.confirm("⚠️ Isso apagará TODOS os pedidos e NÃO devolverá estoque. Deseja continuar?")) return;

      api.delete("/pedidos/limpar-tudo")
        .then(() => {
          alert("Todos os pedidos foram apagados!");
          carregar();
        })
        .catch(err => {
          alert("Erro ao limpar pedidos");
          console.error(err);
        });
    }}
    className="bg-red-800 hover:bg-red-900 text-white px-6 py-3 rounded-lg font-bold shadow"
  >
    Limpar TUDO (sem devolver estoque)
  </button>
</div>


      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="border-b bg-gray-100">
            <th className="p-3 text-left">ID</th>
            <th className="text-left">Cliente</th>
            <th>Data</th>
            <th>Total</th>
            <th>Status</th>
            <th className="text-center">Ações</th>
          </tr>
        </thead>

        <tbody>
          {pedidos.map(p => (
            <tr key={p.id} className="border-b">
              <td className="p-3">{p.id}</td>
              <td>{p.cliente_nome}</td>
              <td>{new Date(p.data_pedido).toLocaleString("pt-BR")}</td>
              <td className="text-green-600 font-bold">
                R$ {Number(p.total).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </td>
              <td className="font-bold">{p.status}</td>

              <td className="p-2 text-center">
                <div className="flex gap-2 justify-center">

  {p.status === "ABERTO" && (
    <>
      <button onClick={() => editarPedido(p.id)} className="bg-blue-600 text-white px-3 py-1 rounded">
        Editar
      </button>

      <button onClick={() => cancelarPedido(p.id)} className="bg-yellow-600 text-white px-3 py-1 rounded">
        Cancelar
      </button>

      <button onClick={() => confirmarPedido(p.id)} className="bg-green-600 text-white px-3 py-1 rounded">
        Finalizar
      </button>

      <button onClick={() => excluirPedido(p.id)} className="bg-red-700 text-white px-3 py-1 rounded">
        Excluir
      </button>
    </>
  )}

  {p.status === "CANCELADO" && (
    <button 
      onClick={() => excluirPedido(p.id)}
      className="bg-red-700 text-white px-4 py-1 rounded hover:bg-red-900 font-bold"
    >
      Excluir Permanente
    </button>
  )}

  {p.status === "FINALIZADO" && (
    <span className="text-green-700 font-bold">
      Finalizado
    </span>
  )}

</div>

              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}