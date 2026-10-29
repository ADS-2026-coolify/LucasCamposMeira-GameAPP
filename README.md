# ⭐ Pega Estrelas

Jogo simples onde você pega estrelas e foge de bombas, com ranking online.

**Autor:** Lucas Campos Meira
**Disciplina:** Tópicos Avançados em Tecnologia (ADS, 3º semestre)

## Como jogar

- Digite seu nome e clique em **Começar**.
- Mova a cesta com as setas **← →** ou com o mouse (no celular, com o dedo).
- Cada **estrela** pega vale 1 ponto.
- Pegar uma **bomba** ou deixar uma estrela cair tira 1 vida. Você começa com 3.
- Quanto mais pontos, mais rápido e mais objetos caem.
- No fim da partida, a pontuação vai para o **ranking**, que é salvo no servidor.

- **Frontend:** React + Vite (`frontend/`)
- **Backend:** Node.js + Express (`backend/`): API de ranking que salva em `ranking.json`
- **Deploy:** um único container Docker (`Dockerfile`). O backend serve a API e também as páginas do React.

```
Aplicação/
├── backend/
│   ├── server.js        ← API (/api/ranking, /api/pontuacao, /api/health)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx      ← tela principal (nome, botão, ranking)
│   │   ├── Jogo.jsx     ← o jogo no <canvas>
│   │   ├── Ranking.jsx  ← lista do ranking
│   │   └── api.js       ← chamadas para o backend
│   └── package.json
├── Dockerfile           ← usado pelo Coolify
└── README.md
```

## Rotas da API

| Método | Rota              | O que faz                                   |
|--------|-------------------|---------------------------------------------|
| GET    | `/api/health`     | Responde `{ "status": "ok" }`               |
| GET    | `/api/ranking`    | Lista as 10 maiores pontuações              |
| POST   | `/api/pontuacao`  | Salva `{ "nome": "Lucas", "pontos": 12 }`   |

---

## Rodar no seu computador (desenvolvimento)

Abra **dois terminais**.

Terminal 1 (backend, porta 3000):

```bash
cd backend
npm install
npm run dev
```

Terminal 2 (frontend, porta 5173):

```bash
cd frontend
npm install
npm run dev
```

Acesse **http://localhost:5173**. O Vite manda as chamadas `/api` para o backend automaticamente (veja `frontend/vite.config.js`).

### Testar a versão de produção com Docker (opcional)

Com o Docker Desktop aberto:

```bash
docker build -t pega-estrelas .
docker run -p 3000:3000 pega-estrelas
```

Acesse **http://localhost:3000**.

---

## Subir no Coolify (passo a passo)

O Coolify busca o código em um repositório Git, lê o `Dockerfile`, gera a imagem e coloca a aplicação no ar. Então o primeiro passo é colocar o projeto no GitHub.

### 1. Enviar o código para o GitHub

1. Crie um repositório vazio em https://github.com/new (ex.: `pega-estrelas`). **Não** marque "Add a README".
2. Na pasta do projeto, rode:

```bash
git init
git add .
git commit -m "Primeira versão do Pega Estrelas"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/pega-estrelas.git
git push -u origin main
```

> Os arquivos `node_modules`, `dist` e `data` não sobem, porque estão no `.gitignore`.

### 2. Criar a aplicação no Coolify

1. Entre no painel do Coolify.
2. Vá em **Projects** → escolha (ou crie) um projeto → **+ New** / **Add Resource**.
3. Escolha a origem do código:
   - Repositório **público**: **Public Repository**, e cole a URL `https://github.com/SEU_USUARIO/pega-estrelas`.
   - Repositório **privado**: **Private Repository (with GitHub App)**. O Coolify vai pedir para instalar o GitHub App na sua conta. Depois, escolha o repositório.
4. Escolha o servidor e o branch `main`.
5. Em **Build Pack**, selecione **Dockerfile** (não use Nixpacks).
6. Clique em **Continue** / **Save**.

### 3. Configurar a aplicação

Na tela de configuração da aplicação:

- **Ports Exposes:** `3000`
- **Domains:** coloque o domínio que você quer usar, ex. `https://estrelas.seudominio.com`. Se não tiver um domínio, use o que o Coolify gera automaticamente (algo como `http://xxxx.IP.sslip.io`).
- **Health Check** (opcional, mas recomendado): ative e use o caminho `/api/health` na porta `3000`.

### 4. Guardar o ranking com um volume (importante!)

Sem isso, o ranking é **apagado a cada novo deploy**, porque o container é recriado do zero.

1. Na aplicação, abra a aba **Storages** (ou **Persistent Storage**).
2. Clique em **+ Add** → **Volume Mount**.
3. Preencha:
   - **Name:** `ranking`
   - **Destination Path:** `/app/data`
4. Salve.

### 5. Fazer o deploy

Clique em **Deploy**. Em **Deployments / Logs** você acompanha o build. No final, deve aparecer a linha:

```
Servidor rodando na porta 3000
```

Abra o domínio configurado e jogue! 🎉

### 6. Atualizar depois

Sempre que mudar o código:

```bash
git add .
git commit -m "Descreva a mudança"
git push
```

Depois clique em **Redeploy** no Coolify. Se quiser que isso aconteça sozinho a cada push, ative o **Auto Deploy** na aplicação (funciona direto com o GitHub App, ou com um webhook no caso de repositório público).

---

## Problemas comuns

| Problema | Solução |
|----------|---------|
| "Bad Gateway" / "no available server" | Confira se **Ports Exposes** está `3000`. |
| Ranking zera depois do deploy | Faltou o volume em `/app/data` (passo 4). |
| Build falha em `npm ci` | Confira se `package-lock.json` foi enviado junto para o GitHub (`frontend/` e `backend/`). |
| Coolify usou Nixpacks | Troque o **Build Pack** para **Dockerfile** e faça o deploy de novo. |
