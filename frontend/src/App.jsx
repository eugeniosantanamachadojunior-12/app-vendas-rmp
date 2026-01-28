import bg from "./assets/bg.jpg";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Vendas from "./pages/Vendas";
import Clientes from "./pages/Clientes";
import Pedidos from "./pages/Pedidos";
import Produtos from "./pages/Produtos";

export default function App() {
  return (
    <Router>
      {/* Fundo do sistema */}
      <div
        className="flex h-screen overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url(${bg})` }}

      >
        {/* Overlay escuro */}
        <div className="flex w-full h-full bg-black/60">

          {/* Sidebar */}
          <div className="bg-black w-64 flex-shrink-0 z-20">
            <Sidebar />
          </div>

          {/* Área principal */}
          <main className="flex-1 relative flex flex-col overflow-hidden">

            {/* Header */}
            <header className="bg-white/90 backdrop-blur p-4 shadow-sm border-b z-10">
              <h2 className="text-gray-700 font-medium">
                Sistema de Vendas | RMP Motorsport
              </h2>
            </header>

            {/* Conteúdo */}
            <div className="flex-1 relative overflow-y-auto">

              {/* Rotas */}
              <div className="p-8 relative z-10">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/produtos" element={<Produtos />} />
                  <Route path="/vendas" element={<Vendas />} />
                  <Route path="/clientes" element={<Clientes />} />
                  <Route path="/pedidos" element={<Pedidos />} />
                  <Route
                    path="*"
                    element={
                      <div className="p-4 font-bold text-gray-300">
                        Página não encontrada
                      </div>
                    }
                  />
                </Routes>
              </div>

            </div>
          </main>

        </div>
      </div>
    </Router>
  );
}
