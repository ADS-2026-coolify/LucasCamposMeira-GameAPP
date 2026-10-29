import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PORT = process.env.PORT || 3000;
// Pasta onde o ranking é salvo (no Coolify, monte um volume aqui)
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "data");
// Pasta com o build do React (no Docker, o Dockerfile copia o build para cá)
const STATIC_DIR = process.env.STATIC_DIR || path.join(__dirname, "public");
const ARQUIVO_RANKING = path.join(DATA_DIR, "ranking.json");

fs.mkdirSync(DATA_DIR, { recursive: true });

function lerRanking() {
  try {
    return JSON.parse(fs.readFileSync(ARQUIVO_RANKING, "utf-8"));
  } catch {
    return [];
  }
}

function salvarRanking(ranking) {
  fs.writeFileSync(ARQUIVO_RANKING, JSON.stringify(ranking, null, 2));
}

const app = express();
app.use(express.json());

// Verificação de saúde (útil para o health check do Coolify)
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Retorna as 10 maiores pontuações
app.get("/api/ranking", (req, res) => {
  const top10 = lerRanking()
    .sort((a, b) => b.pontos - a.pontos)
    .slice(0, 10);
  res.json(top10);
});

// Salva uma nova pontuação
app.post("/api/pontuacao", (req, res) => {
  const nome = String(req.body?.nome || "").trim().slice(0, 20);
  const pontos = Number(req.body?.pontos);

  if (!nome) {
    return res.status(400).json({ erro: "Informe um nome." });
  }
  if (!Number.isInteger(pontos) || pontos < 0 || pontos > 100000) {
    return res.status(400).json({ erro: "Pontuação inválida." });
  }

  const ranking = lerRanking();
  const registro = { nome, pontos, data: new Date().toISOString() };
  ranking.push(registro);
  salvarRanking(ranking);

  res.status(201).json(registro);
});

// Serve o frontend (React) e devolve o index.html para qualquer outra rota
if (fs.existsSync(STATIC_DIR)) {
  app.use(express.static(STATIC_DIR));
  app.get("*", (req, res) => {
    res.sendFile(path.join(STATIC_DIR, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
