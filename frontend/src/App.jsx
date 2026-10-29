import { useEffect, useState } from "react";
import Jogo from "./Jogo.jsx";
import Ranking from "./Ranking.jsx";
import { buscarRanking, enviarPontuacao } from "./api.js";

export default function App() {
  const [nome, setNome] = useState("");
  const [jogando, setJogando] = useState(false);
  const [ultimaPontuacao, setUltimaPontuacao] = useState(null);
  const [ranking, setRanking] = useState([]);
  const [mensagem, setMensagem] = useState("");

  async function carregarRanking() {
    try {
      setRanking(await buscarRanking());
    } catch {
      setMensagem("Não foi possível carregar o ranking.");
    }
  }

  useEffect(() => {
    carregarRanking();
  }, []);

  function comecar() {
    if (!nome.trim()) {
      setMensagem("Digite seu nome para jogar.");
      return;
    }
    setMensagem("");
    setUltimaPontuacao(null);
    setJogando(true);
  }

  async function aoTerminar(pontos) {
    setJogando(false);
    setUltimaPontuacao(pontos);
    try {
      await enviarPontuacao(nome.trim(), pontos);
      await carregarRanking();
    } catch (erro) {
      setMensagem(erro.message);
    }
  }

  return (
    <main>
      <h1>⭐ Pega Estrelas</h1>

      <div className="layout">
        <section>
          <Jogo jogando={jogando} aoTerminar={aoTerminar} />

          {!jogando && (
            <div className="controles">
              {ultimaPontuacao !== null && (
                <p className="resultado">Fim de jogo! Você fez <b>{ultimaPontuacao}</b> pontos.</p>
              )}
              <input
                type="text"
                placeholder="Seu nome"
                maxLength={20}
                value={nome}
                onChange={e => setNome(e.target.value)}
                onKeyDown={e => e.key === "Enter" && comecar()}
              />
              <button onClick={comecar}>
                {ultimaPontuacao === null ? "Começar" : "Jogar de novo"}
              </button>
            </div>
          )}

          {mensagem && <p className="mensagem">{mensagem}</p>}
          <p className="dica">Use ← → ou o mouse para mover a cesta. Pegue as estrelas e fuja das bombas!</p>
        </section>

        <Ranking ranking={ranking} />
      </div>
    </main>
  );
}
