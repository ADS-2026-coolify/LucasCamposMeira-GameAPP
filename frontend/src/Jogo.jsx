import { useEffect, useRef, useState } from "react";

const LARGURA = 480;
const ALTURA = 560;

function desenharEstrela(ctx, x, y, r) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const angulo = (Math.PI / 5) * i - Math.PI / 2;
    const raio = i % 2 === 0 ? r : r / 2.2;
    ctx.lineTo(x + Math.cos(angulo) * raio, y + Math.sin(angulo) * raio);
  }
  ctx.closePath();
  ctx.fillStyle = "#ffd447";
  ctx.fill();
}

function desenharBomba(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = "#222";
  ctx.fill();
  ctx.strokeStyle = "#ff4d4d";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = "#ff8c00";
  ctx.fillRect(x - 2, y - r - 6, 4, 6);
}

export default function Jogo({ jogando, aoTerminar }) {
  const canvasRef = useRef(null);
  const [pontos, setPontos] = useState(0);
  const [vidas, setVidas] = useState(3);

  // Guarda o aoTerminar mais recente sem reiniciar o loop do jogo
  const aoTerminarRef = useRef(aoTerminar);
  aoTerminarRef.current = aoTerminar;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!jogando) {
      // Tela parada quando não está jogando
      ctx.clearRect(0, 0, LARGURA, ALTURA);
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.font = "24px Arial";
      ctx.fillText("Digite seu nome e clique em Começar!", LARGURA / 2, ALTURA / 2);
      return;
    }

    const cesta = { x: LARGURA / 2 - 40, y: 520, largura: 80, altura: 20, velocidade: 7 };
    const teclas = {};
    let objetos = [];
    let pts = 0;
    let vds = 3;
    let quadro = 0;
    let idAnimacao;
    let terminou = false;

    setPontos(0);
    setVidas(3);

    function criarObjeto() {
      objetos.push({
        x: Math.random() * (LARGURA - 30) + 15,
        y: -20,
        raio: 14,
        velocidade: 2 + Math.random() * 2 + pts / 20,
        bomba: Math.random() < 0.25
      });
    }

    function atualizar() {
      if (teclas.ArrowLeft) cesta.x -= cesta.velocidade;
      if (teclas.ArrowRight) cesta.x += cesta.velocidade;
      cesta.x = Math.max(0, Math.min(LARGURA - cesta.largura, cesta.x));

      // Fica mais frequente conforme a pontuação sobe
      const intervalo = Math.max(20, 60 - pts);
      if (quadro % intervalo === 0) criarObjeto();

      for (let i = objetos.length - 1; i >= 0; i--) {
        const o = objetos[i];
        o.y += o.velocidade;

        const pegou =
          o.y + o.raio >= cesta.y &&
          o.y - o.raio <= cesta.y + cesta.altura &&
          o.x >= cesta.x && o.x <= cesta.x + cesta.largura;

        if (pegou) {
          if (o.bomba) vds--;
          else pts++;
          objetos.splice(i, 1);
        } else if (o.y - o.raio > ALTURA) {
          if (!o.bomba) vds--;
          objetos.splice(i, 1);
        }
      }

      setPontos(pts);
      setVidas(Math.max(0, vds));
    }

    function desenhar() {
      ctx.clearRect(0, 0, LARGURA, ALTURA);
      ctx.fillStyle = "#8b5a2b";
      ctx.fillRect(cesta.x, cesta.y, cesta.largura, cesta.altura);
      ctx.fillStyle = "#a0522d";
      ctx.fillRect(cesta.x - 5, cesta.y - 5, cesta.largura + 10, 6);

      for (const o of objetos) {
        if (o.bomba) desenharBomba(ctx, o.x, o.y, o.raio);
        else desenharEstrela(ctx, o.x, o.y, o.raio);
      }
    }

    function loop() {
      atualizar();
      desenhar();
      quadro++;
      if (vds <= 0) {
        terminou = true;
        aoTerminarRef.current(pts);
        return;
      }
      idAnimacao = requestAnimationFrame(loop);
    }

    // Controles
    const aoApertar = e => { teclas[e.key] = true; };
    const aoSoltar = e => { teclas[e.key] = false; };
    const aoMoverPonteiro = e => {
      const ret = canvas.getBoundingClientRect();
      const escala = LARGURA / ret.width;
      cesta.x = (e.clientX - ret.left) * escala - cesta.largura / 2;
    };

    document.addEventListener("keydown", aoApertar);
    document.addEventListener("keyup", aoSoltar);
    canvas.addEventListener("pointermove", aoMoverPonteiro);
    canvas.addEventListener("pointerdown", aoMoverPonteiro);

    idAnimacao = requestAnimationFrame(loop);

    return () => {
      if (!terminou) cancelAnimationFrame(idAnimacao);
      document.removeEventListener("keydown", aoApertar);
      document.removeEventListener("keyup", aoSoltar);
      canvas.removeEventListener("pointermove", aoMoverPonteiro);
      canvas.removeEventListener("pointerdown", aoMoverPonteiro);
    };
  }, [jogando]);

  return (
    <div>
      <div className="placar">
        <span>Pontos: <b>{pontos}</b></span>
        <span>Vidas: <b>{vidas}</b></span>
      </div>
      <canvas ref={canvasRef} width={LARGURA} height={ALTURA} />
    </div>
  );
}
