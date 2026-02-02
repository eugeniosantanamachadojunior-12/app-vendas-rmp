const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET;

// CADASTRO
exports.register = async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ error: "Informe nome, email e senha" });
  }

  try {
    // verifica duplicidade
    const [existe] = await db.query(
      "SELECT id FROM usuarios WHERE email = ?",
      [email]
    );

    if (existe.length > 0) {
      return res.status(400).json({ error: "Email já cadastrado" });
    }

    // gera hash
    const hash = await bcrypt.hash(senha, 10);

    // salva
    await db.query(
      "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)",
      [nome, email, hash]
    );

    res.status(201).json({ message: "Usuário criado com sucesso" });

  } catch (error) {
    res.status(500).json({ error: "Erro ao criar usuário" });
  }
};

// LOGIN
// LOGIN
exports.login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const [rows] = await db.query(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );

    console.log("USUÁRIOS DO BANCO REAL:", rows);

    if (rows.length === 0) {
      return res.status(401).json({ error: "Usuário não encontrado" });
    }

    const usuario = rows[0];

    console.log("HASH BANCO:", usuario.senha);

    const valido = await bcrypt.compare(senha, usuario.senha);
    console.log("BCRYPT RESULT:", valido);

    if (!valido) {
      return res.status(401).json({ error: "Senha inválida" });
    }

const token = jwt.sign(
  { id: usuario.id, email: usuario.email },
  process.env.JWT_SECRET,
  { expiresIn: "8h" }
);


    res.json({ token });

  } catch (error) {
    res.status(500).json({ error: "Erro no login" });
  }
};
