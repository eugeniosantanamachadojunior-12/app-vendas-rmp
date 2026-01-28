import logo from "../assets/logo-rmp.png";
import { NavLink } from "react-router-dom";

export default function Sidebar() {

  function handleLogout() {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  // Estilo base limpo
  const baseStyle = "block py-3 px-4 rounded-lg transition-all duration-300 mb-1";
  
  // Estilo ATIVO
  const activeStyle =
    "bg-gradient-to-r from-red-700 to-red-600 text-white font-bold shadow-lg shadow-red-900/40 border-l-4 border-red-500";
  
  // Estilo INATIVO
  const inactiveStyle =
    "text-gray-400 hover:text-white hover:bg-zinc-900/80";

  const menuItems = [
    { name: "Dashboard", path: "/" },
    { name: "Produtos", path: "/produtos" },
    { name: "Clientes", path: "/clientes" },
    { name: "Pedidos", path: "/pedidos" },
    { name: "Vendas", path: "/vendas" },
  ];

  return (
    <aside className="w-64 bg-black text-white h-full p-6 flex flex-col">
      
      {/* Logo */}
      <div className="relative flex flex-col items-center mb-6">
        <div className="absolute w-36 h-36 rounded-full bg-red-600 blur-3xl opacity-40 animate-glow-pulse"></div>

        <img 
          src={logo}
          alt="RMP Motorsport"
          className="relative w-28 z-10"
        />

        <span className="mt-3 text-red-600 font-bold text-xl tracking-wide">
          RMP Motorsport
        </span>
      </div>

      <nav className="flex-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `${baseStyle} ${isActive ? activeStyle : inactiveStyle}`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Logout real */}
      <div className="mt-auto pt-6 border-t border-zinc-800">
        <button
          onClick={handleLogout}
          className="text-sm text-gray-400 hover:text-red-500 flex items-center gap-2 transition"
        >
          <span>Sair do Sistema</span>
        </button>
      </div>

    </aside>
  );
}
