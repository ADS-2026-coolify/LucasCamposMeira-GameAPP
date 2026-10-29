# ⭐ PEGA ESTRELAS — Jogo Arcade com Ranking Online

**Pega Estrelas** é um jogo arcade para navegador em que o jogador controla uma cesta para pegar estrelas que caem do céu, enquanto desvia de bombas. A cada partida a dificuldade aumenta, e a pontuação final é enviada para um **ranking online** compartilhado entre todos os jogadores.

A aplicação foi construída do zero, separada em **frontend** (React) e **backend** (Node.js + Express), e empacotada em um único container Docker para facilitar a publicação.

**Autor:** Lucas Campos Meira
---

## 🚀 Funcionalidades Principais

### 1. 🎮 Jogo Arcade em Canvas
- **Controle da Cesta**: Movimentação pelas setas **← →** do teclado, pelo mouse ou pelo toque no celular.
- **Estrelas e Bombas**:
  - Cada **estrela** pega vale **+1 ponto**.
  - Pegar uma **bomba** custa **1 vida**.
  - Deixar uma **estrela cair** também custa **1 vida**.
- **Sistema de Vidas**: O jogador começa com **3 vidas**, e a partida termina quando elas acabam.
- **Dificuldade Progressiva**: Quanto mais pontos, mais rápido e com mais frequência os objetos caem.
- **Gráficos Desenhados por Código**: Estrelas, bombas e cesta são desenhadas com a API Canvas 2D, sem imagens externas.

### 2. 🏆 Ranking Online
- Ao fim de cada partida, o **nome** e a **pontuação** do jogador são enviados ao backend.
- O painel lateral exibe o **Top 10** de todos os jogadores, atualizado logo após cada partida.
- O ranking fica salvo no servidor, então é o mesmo para qualquer pessoa que acessar o jogo.

---

## 🧩 Como a Aplicação Foi Feita

1. **Protótipo**: O jogo começou como uma única página HTML com JavaScript puro, para validar a mecânica (cesta, estrelas, bombas e vidas).
2. **Migração para React**: A tela foi dividida em componentes:
   - `Jogo.jsx`: o loop do jogo no `<canvas>`, com `useEffect` e `requestAnimationFrame`.
   - `Ranking.jsx`: a lista com as melhores pontuações.
   - `App.jsx`: junta tudo e controla o nome do jogador, o início e o fim da partida.
   - `api.js`: as chamadas `fetch` para o backend.
3. **Backend com Express**: Foi criada uma API REST em `backend/server.js` que recebe e devolve as pontuações, salvando-as em um arquivo `ranking.json`.
4. **Integração**: Em desenvolvimento, o Vite redireciona as chamadas `/api` para o backend (proxy). Em produção, o próprio Express serve as páginas do React e a API no mesmo endereço.
5. **Containerização**: Um `Dockerfile` em duas etapas gera o build do React e monta a imagem final só com o backend e os arquivos estáticos.

```
├── backend/
│   └── server.js         ← API REST (Express)
├── frontend/
│   └── src/
│       ├── App.jsx       ← tela principal
│       ├── Jogo.jsx      ← o jogo (canvas)
│       ├── Ranking.jsx   ← ranking
│       └── api.js        ← comunicação com o backend
└── Dockerfile            ← build da imagem de produção
```

---

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 18, Vite, JavaScript (JSX), Canvas 2D API, CSS puro.
- **Backend**: Node.js 20, Express.
- **Persistência**: Arquivo JSON no servidor (`ranking.json`).
- **Infraestrutura**: Docker (build multi-stage com `node:20-alpine`).

---

## 📦 Como Executar o Projeto Localmente

### 1. Rodar o Backend (porta 3000)
```bash
cd backend
npm install
npm run dev
```
API disponível em: `http://localhost:3000/api/health`.

### 2. Rodar o Frontend (porta 5173)
Em outro terminal:
```bash
cd frontend
npm install
npm run dev
```
Acesse a aplicação no navegador: `http://localhost:5173`.

### 3. Rodar com Docker
```bash
docker build -t pega-estrelas .
docker run -p 3000:3000 pega-estrelas
```
Acesse: `http://localhost:3000`.

---
