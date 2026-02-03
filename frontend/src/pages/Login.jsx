import { useState } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

 async function handleLogin(e) {
  e.preventDefault();

  try {
    setLoading(true);

    const res = await api.post("/auth/login", {
      email,
      senha,
    });

    localStorage.setItem("token", res.data.token);
    navigate("/");
  } catch (err) {
    alert(err.response?.data?.error || "Login inválido");
  } finally {
    setLoading(false);
  }
}


  return (
    <div className="h-screen flex items-center justify-center bg-black">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded w-80"
      >
        <h2 className="text-xl mb-4 text-center">Login</h2>

        <input
          className="border w-full mb-3 p-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="border w-full mb-4 p-2"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        <button
          disabled={loading}
          className="bg-red-600 text-white w-full p-2"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>

        <p className="text-sm text-center mt-4 text-gray-600">
          Não tem conta?{" "}
          <span
            className="text-red-600 cursor-pointer hover:underline"
            onClick={() => navigate("/register")}
          >
            Criar conta
          </span>
        </p>
      </form>
    </div>
  );
}
