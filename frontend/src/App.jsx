import bg from "./assets/bg.jpg";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Vendas from "./pages/Vendas";
import Clientes from "./pages/Clientes";
import Pedidos from "./pages/Pedidos";
import Produtos from "./pages/Produtos";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { isTokenValid } from "./utils/isTokenValid";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div
      className="flex h-screen overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="flex w-full h-full bg-black/60">
        <div className="bg-black w-64 flex-shrink-0">
          <Sidebar />
        </div>

        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white/90 p-4 border-b">
            <h2 className="text-gray-700 font-medium">
              Sistema de Vendas | RMP Motorsport
            </h2>
          </header>

          <div className="flex-1 overflow-y-auto p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const token = localStorage.getItem("token");
  const isAuthenticated = token && isTokenValid(token);

  if (
    !isAuthenticated &&
    window.location.pathname !== "/login" &&
    window.location.pathname !== "/register"
  ) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    return null;
  }

  return (
    <Router>
      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="produtos" element={<Produtos />} />
          <Route path="clientes" element={<Clientes />} />
          <Route path="pedidos" element={<Pedidos />} />
          <Route path="vendas" element={<Vendas />} />
        </Route>

      </Routes>
    </Router>
  );
}
