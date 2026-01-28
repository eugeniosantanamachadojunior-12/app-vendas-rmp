import { useState } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();

    try {
      await api.post("/auth/register", { nome, email, senha });
      alert("Usuário criado com sucesso!");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.error || "Erro ao cadastrar");
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-black">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded w-80">
        <h2 className="text-xl mb-4 text-center">Criar conta</h2>

        <input
          className="border w-full mb-3 p-2"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

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

        <button className="bg-red-600 text-white w-full p-2">
          Cadastrar
        </button>
      </form>
    </div>
  );
}
