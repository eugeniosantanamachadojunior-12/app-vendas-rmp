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
      console.log("PRODUTOS:", res.data);
      setProdutos(res.data || []);
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

  // 🚀 NOVAS FUNÇÕES (IMPORTADOR)

  const adicionarLinha = () => {
    const tabela = document.getElementById('corpoTabela');

    tabela.innerHTML += `
      <tr>
        <td contenteditable="true"></td>
        <td contenteditable="true"></td>
        <td contenteditable="true"></td>
      </tr>
    `;
  };

  const salvarProdutosLote = async () => {
    const linhas = document.querySelectorAll('#corpoTabela tr');

    const produtos = [];

    linhas.forEach(linha => {
      const colunas = linha.querySelectorAll('td');

      const nome = colunas[0].innerText.trim();
      const preco = parseFloat(colunas[1].innerText.replace(",", "."));
      const estoque = parseInt(colunas[2].innerText);

      if (nome) {
        produtos.push({ nome, preco, estoque });
      }
    });

    if (produtos.length === 0) {
      alert("Nenhum produto válido!");
      return;
    }

    await api.post('/produtos/lote', produtos);

    alert('Produtos cadastrados em massa 🚀');

    carregar();
  };

  // 🔥 COLAR DO EXCEL

  useEffect(() => {
    const handlePaste = (e) => {
      const texto = e.clipboardData.getData('text');

      if (texto.includes('\t')) {
        e.preventDefault();

        const linhas = texto.split('\n');
        const tabela = document.getElementById('corpoTabela');

        linhas.forEach(linha => {
          const [nome, preco, estoque] = linha.split('\t');

          tabela.innerHTML += `
            <tr>
              <td contenteditable="true">${nome || ''}</td>
              <td contenteditable="true">${preco || ''}</td>
              <td contenteditable="true">${estoque || ''}</td>
            </tr>
          `;
        });
      }
    };

    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, []);

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

      <table className="w-full bg-white shadow text-center border-collapse table-fixed">
  <thead className="bg-gray-200">
    <tr>
      <th className="p-3 w-1/4">Nome</th>
      <th className="p-3 w-1/4">Preço</th>
      <th className="p-3 w-1/4">Estoque</th>
      <th className="p-3 w-1/4">Ações</th>
    </tr>
  </thead>

  <tbody>
    {produtos.map(p => (
      <tr key={p.id} className="border-t hover:bg-gray-100">
        <td className="p-3">{p.nome}</td>

        <td className="p-3">
          R$ {Number(p.preco).toFixed(2)}
        </td>

        <td className="p-3">{p.estoque}</td>

        <td className="p-3">
          <div className="flex justify-center gap-4">
            <button
              onClick={() => editar(p)}
              className="text-blue-600 hover:underline"
            >
              Editar
            </button>

            <button
              onClick={() => excluir(p.id)}
              className="text-red-600 hover:underline"
            >
              Excluir
            </button>
          </div>
        </td>
      </tr>
    ))}
  </tbody>
</table>

      {/* 🚀 IMPORTADOR EM MASSA */}
      <div className="bg-white p-4 mt-6 shadow">
        <h2 className="text-lg font-bold mb-2">Importação em Massa</h2>

        <table className="w-full border">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Preço</th>
              <th>Estoque</th>
            </tr>
          </thead>

          <tbody id="corpoTabela">
            <tr>
              <td contentEditable className="border p-1"></td>
              <td contentEditable className="border p-1"></td>
              <td contentEditable className="border p-1"></td>
            </tr>
          </tbody>
        </table>

        <div className="mt-2 flex gap-2">
          <button onClick={adicionarLinha} className="bg-gray-500 text-white px-3">
            + Linha
          </button>

          <button onClick={salvarProdutosLote} className="bg-green-600 text-white px-3">
            Salvar em Massa
          </button>
        </div>
      </div>
    </div>
  );
}