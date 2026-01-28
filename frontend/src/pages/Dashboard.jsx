import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function Dashboard() {
  const [stats, setStats] = useState({
    vendasHoje: 0,
    pedidos: 0,
    clientes: 0
  });

  useEffect(() => {
  async function carregarDados() {
  try {
    const [resPedidos, resClientes] = await Promise.all([
      api.get("/pedidos"),
      api.get("/clientes")
    ]);

    // 1. Contagem direta (Isso deve mostrar 59 e 3 conforme seu console)
    const totalPedidos = resPedidos.data.length;
    const totalClientes = resClientes.data.length;

    // 2. Cálculo de Vendas (Flexível para diferentes nomes de colunas)
    const hoje = new Date().toISOString().split('T')[0];

    const valorVendasHoje = resPedidos.data.reduce((acc, p) => {
      // Tenta encontrar a data em diferentes campos comuns
      const campoData = p.data || p.created_at || p.data_pedido || "";
      const dataFormatada = campoData.split('T')[0];
      
      // Tenta encontrar o valor total do pedido
      const valor = Number(p.total || p.valor_total || p.valor || 0);

      // Soma se a data for hoje (ou remova o IF para testar a soma total geral)
      if (dataFormatada === hoje) {
        return acc + valor;
      }
      return acc;
    }, 0);

    // 3. Atualiza o estado com os números REAIS do console
    setStats({
      vendasHoje: valorVendasHoje,
      pedidos: totalPedidos,   // Aqui aparecerá o 59 da sua imagem
      clientes: totalClientes  // Aqui aparecerá o 3 da sua imagem
    });

  } catch (err) {
    console.error("Erro ao processar dados:", err);
  }
}

    carregarDados();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card Vendas Hoje */}
        <div className="bg-white shadow rounded p-6 border-l-4 border-red-600">
          <p className="text-gray-500 font-medium">Vendas Hoje</p>
          <p className="text-3xl font-bold text-red-600">
            R$ {stats.vendasHoje.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
        </div>

        {/* Card Pedidos */}
        <div className="bg-white shadow rounded p-6 border-l-4 border-red-600">
          <p className="text-gray-500 font-medium">Pedidos</p>
          <p className="text-3xl font-bold text-red-600">
            {stats.pedidos}
          </p>
        </div>

        {/* Card Clientes */}
        <div className="bg-white shadow rounded p-6 border-l-4 border-red-600">
          <p className="text-gray-500 font-medium">Clientes</p>
          <p className="text-3xl font-bold text-red-600">
            {stats.clientes}
          </p>
        </div>
      </div>

      {/* Dica de Debug visual se tudo estiver zero */}
      {stats.pedidos === 0 && (
        <p className="mt-4 text-sm text-gray-400 italic">
          * Se houver dados no console mas aqui estiver zero, verifique os nomes dos campos na API.
        </p>
      )}
    </div>
  );
}