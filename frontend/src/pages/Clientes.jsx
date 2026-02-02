import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState({
    nome: "",
    telefone: "",
    email: "",
    cpf_cnpj: ""
  });
  const [editandoId, setEditandoId] = useState(null);

  // Histórico
  const [historico, setHistorico] = useState([]);
  const [clienteHistorico, setClienteHistorico] = useState(null);

  function carregar() {
  api.get("/clientes").then(res => setClientes(res.data.rows));
}


  useEffect(() => {
    carregar();
  }, []);

  function salvar(e) {
    e.preventDefault();

    const req = editandoId
      ? api.put(`/clientes/${editandoId}`, form)
      : api.post("/clientes", form);

    req.then(() => {
      setForm({ nome: "", telefone: "", email: "", cpf_cnpj: "" });
      setEditandoId(null);
      carregar();
    });
  }

  function editar(c) {
    setForm({
      nome: c.nome,
      telefone: c.telefone,
      email: c.email,
      cpf_cnpj: c.cpf_cnpj
    });
    setEditandoId(c.id);
  }

  function excluir(id) {
    if (!window.confirm("Deseja excluir este cliente?")) return;
    api.delete(`/clientes/${id}`).then(() => carregar());
  }

  function verHistorico(cliente) {
    api.get(`/clientes/${cliente.id}/historico`)
  .then(res => {
    setHistorico(res.data.rows);

        setClienteHistorico(cliente);
      });
  }

 return (
  <div className="p-6 max-w-7xl mx-auto">
    
    {/* Card branco translúcido */}
    <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-xl p-6">

      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Clientes
      </h1>

      {/* Formulário */}
      <form onSubmit={salvar} className="grid grid-cols-4 gap-4 mb-6">
        <input
          placeholder="Nome"
          className="border p-2 rounded bg-white text-gray-800"
          value={form.nome}
          onChange={e => setForm({ ...form, nome: e.target.value })}
        />

        <input
          placeholder="Telefone"
          className="border p-2 rounded bg-white text-gray-800"
          value={form.telefone}
          onChange={e => setForm({ ...form, telefone: e.target.value })}
        />

        <input
          placeholder="Email"
          className="border p-2 rounded bg-white text-gray-800"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />

        <input
          placeholder="CPF/CNPJ"
          className="border p-2 rounded bg-white text-gray-800"
          value={form.cpf_cnpj}
          onChange={e => setForm({ ...form, cpf_cnpj: e.target.value })}
        />

        <button className="col-span-4 bg-green-600 hover:bg-green-700 text-white py-2 rounded font-semibold">
          {editandoId ? "Salvar Alterações" : "Cadastrar Cliente"}
        </button>
      </form>

      {/* Tabela */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 bg-white rounded">
          <thead className="bg-gray-200 text-gray-800">
            <tr>
              <th className="border p-2">Nome</th>
              <th className="border p-2">Telefone</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">CPF/CNPJ</th>
              <th className="border p-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map(c => (
              <tr key={c.id} className="hover:bg-gray-100">
                <td className="border p-2 text-gray-800">{c.nome}</td>
                <td className="border p-2 text-gray-800">{c.telefone}</td>
                <td className="border p-2 text-gray-800">{c.email}</td>
                <td className="border p-2 text-gray-800">{c.cpf_cnpj}</td>
                <td className="border p-2 space-x-3">
                  <button onClick={() => editar(c)} className="text-blue-600 hover:underline">
                    Editar
                  </button>
                  <button onClick={() => excluir(c.id)} className="text-red-600 hover:underline">
                    Excluir
                  </button>
                  <button onClick={() => verHistorico(c)} className="text-green-600 hover:underline">
                    Histórico
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>

    {/* Modal de Histórico */}
    {clienteHistorico && (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-xl w-2/3 shadow-xl">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Histórico de {clienteHistorico.nome}
          </h2>

          {historico.length === 0 && (
            <p className="text-gray-600">Nenhuma compra encontrada.</p>
          )}

          {historico.map(h => (
            <div key={h.pedido_id} className="border-b py-2 text-gray-700">
              <div>Pedido #{h.pedido_id}</div>
              <div>Itens: {h.itens}</div>
              <div>
                Total: R$ {Number(h.total).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </div>
            </div>
          ))}

          <button
            onClick={() => setClienteHistorico(null)}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Fechar
          </button>
        </div>
      </div>
    )}
  </div>
);
}
