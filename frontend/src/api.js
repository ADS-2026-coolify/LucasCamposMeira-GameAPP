// Funções que conversam com o backend

export async function buscarRanking() {
  const resposta = await fetch("/api/ranking");
  if (!resposta.ok) throw new Error("Erro ao buscar ranking");
  return resposta.json();
}

export async function enviarPontuacao(nome, pontos) {
  const resposta = await fetch("/api/pontuacao", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, pontos })
  });
  if (!resposta.ok) {
    const corpo = await resposta.json().catch(() => ({}));
    throw new Error(corpo.erro || "Erro ao salvar pontuação");
  }
  return resposta.json();
}
