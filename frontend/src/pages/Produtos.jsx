import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [estoque, setEstoque] = useState("");
  const [editandoId, setEditandoId] = useState(null);

  function carregar() {
  api.get("/produtos").then(res => {
    setProdutos(res.data.rows || []);
  });
}


  useEffect(() => {
    carregar();
  }, []);

  function salvar() {
    const dados = {
      nome,
      preco: preco.replace(",", "."),
      estoque
    };

    if (editandoId) {
      api.put(`/produtos/${editandoId}`, dados).then(() => {
        limpar();
        carregar();
      });
    } else {
      api.post("/produtos", dados).then(() => {
        limpar();
        carregar();
      });
    }
  }

  function editar(p) {
    setEditandoId(p.id);
    setNome(p.nome);
    setPreco(p.preco);
    setEstoque(p.estoque);
  }

  function excluir(id) {
    if (confirm("Deseja excluir este produto?")) {
      api.delete(`/produtos/${id}`).then(() => carregar());
    }
  }

  function limpar() {
    setEditandoId(null);
    setNome("");
    setPreco("");
    setEstoque("");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Produtos</h1>

      <div className="bg-white p-4 rounded shadow mb-4 flex gap-2">
        <input className="border p-2" placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} />
        <input className="border p-2" placeholder="Preço" value={preco} onChange={e => setPreco(e.target.value)} />
        <input className="border p-2" placeholder="Estoque" value={estoque} onChange={e => setEstoque(e.target.value)} />
        <button onClick={salvar} className="bg-red-600 text-white px-4">
          {editandoId ? "Atualizar" : "Salvar"}
        </button>
      </div>

      <table className="w-full bg-white shadow">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Preço</th>
            <th>Estoque</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map(p => (
            <tr key={p.id}>
              <td>{p.nome}</td>
              <td>R$ {p.preco}</td>
              <td>{p.estoque}</td>
              <td>
                <button onClick={() => editar(p)} className="text-blue-600 mr-4">Editar</button>
                <button onClick={() => excluir(p.id)} className="text-red-600">Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
