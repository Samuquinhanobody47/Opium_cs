# 🚀 Guia Completo — Publicar a Loja Opium Online

Este guia explica como publicar sua loja de cursos **Opium** na internet, passo a passo.

---

## 📋 Pré-requisitos

Antes de começar, você precisa de:

1. **Conta no GitHub** — [github.com](https://github.com) (grátis)
2. **Um serviço de hospedagem** (escolha um abaixo)
3. **Domínio** (opcional — cada serviço dá um domínio grátis)

---

## 🏆 Opção 1 — Railway (MAIS FÁCIL, com PostgreSQL incluso)

> ✅ Recomendado para iniciantes
> ✅ Banco PostgreSQL já incluso
> ✅ Socket.io funciona normalmente
> ✅ Plano grátis disponível (US$5/mês crédito)

### Passo a Passo:

#### 1. Subir o código para o GitHub

```bash
# No seu computador, baixe os arquivos do projeto
cd opium-platform

# Criar repositório
git init
git add .
git commit -m "Loja Opium pronta para deploy"

# Criar repo no GitHub e conectar
git remote add origin https://github.com/SEU-USUARIO/opium-platform.git
git push -u origin main
```

#### 2. Criar conta no Railway

1. Acesse [railway.app](https://railway.app)
2. Clique em **"Start a New Project"**
3. Escolha **"Deploy from GitHub repo"**
4. Selecione o repositório `opium-platform`

#### 3. Adicionar Banco de Dados

1. No painel do Railway, clique em **"+ New"**
2. Escolha **"Database" → "PostgreSQL"**
3. O Railway cria automaticamente a `DATABASE_URL`

#### 4. Configurar Variáveis de Ambiente

No painel do Railway, vá em **Variables** do serviço `opium-platform` e adicione:

| Variável | Valor |
|----------|-------|
| `DATABASE_URL` | (automático do PostgreSQL do Railway) |
| `NEXTAUTH_URL` | `https://SEU-APP.up.railway.app` |
| `NEXTAUTH_SECRET` | Gere uma em: `openssl rand -base64 32` |
| `GOOGLE_CLIENT_ID` | (veja seção Google OAuth abaixo) |
| `GOOGLE_CLIENT_SECRET` | (veja seção Google OAuth abaixo) |
| `PIX_API_KEY` | Sua chave da API Pix |
| `PIX_WEBHOOK_URL` | `https://SEU-APP.up.railway.app/api/pix/webhook` |
| `PIX_BASE_URL` | URL base da sua API de pagamento |
| `NEXT_PUBLIC_APP_URL` | `https://SEU-APP.up.railway.app` |

#### 5. Deploy!

O Railway faz deploy automático a cada push. Aguarde 2-3 minutos.

#### 6. Rodar Migrações do Banco

No Railway, vá em **your service → Settings → Deploy → Start Command** e mude para:
```
npx prisma db push && npx tsx server.ts
```

Ou rode manualmente no terminal do Railway:
```bash
npx prisma db push
```

#### 7. Acessar a Loja 🎉

Acesse: `https://SEU-APP.up.railway.app`

---

## 🔵 Opção 2 — Render (grátis, com limitações)

> ⚠️ Plano grátis desliga após 15min sem acesso (demora ~30s para acordar)
> ✅ PostgreSQL grátis incluso

### Passo a Passo:

1. Acesse [render.com](https://render.com)
2. Clique em **"New +" → "Web Service"**
3. Conecte o repositório GitHub
4. Configure:
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npx tsx server.ts`
5. Adicione PostgreSQL em **"New +" → "PostgreSQL"**
6. Configure as variáveis de ambiente (mesmas do Railway)
7. Deploy!

---

## 🟢 Opção 3 — VPS Própria (DigitalOcean, Hetzner, Contabo)

> ✅ Controle total
> ✅ Socket.io funciona perfeitamente
> ✅ A partir de ~R$20/mês

### Com Docker (mais fácil):

```bash
# 1. No seu servidor VPS:
git clone https://github.com/SEU-USUARIO/opium-platform.git
cd opium-platform

# 2. Configurar variáveis
cp .env.example .env
nano .env  # edite com seus valores reais

# 3. Subir tudo (PostgreSQL + App)
docker-compose up -d

# 4. Rodar migrações
docker-compose exec app npx prisma db push

# 5. Acessar
# http://IP-DO-SERVIDOR:3000
```

### Sem Docker (instalação direta):

```bash
# 1. Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. Instalar PostgreSQL
sudo apt install postgresql postgresql-contrib
sudo -u postgres createuser opium
sudo -u postgres createdb opium
sudo -u postgres psql -c "ALTER USER opium PASSWORD 'sua-senha';"

# 3. Clonar e configurar
git clone https://github.com/SEU-USUARIO/opium-platform.git
cd opium-platform
npm install
npx prisma generate

# 4. Configurar .env
cp .env.example .env
# Edite: DATABASE_URL, NEXTAUTH_SECRET, etc.

# 5. Rodar migrações e build
npx prisma db push
npm run build

# 6. Iniciar com PM2 (mantém online)
npm install -g pm2 tsx
pm2 start "npx tsx server.ts" --name opium
pm2 save
pm2 startup

# 7. Acessar
# http://IP-DO-SERVIDOR:3000
```

---

## 🔐 Configurar Google OAuth (Login com Google)

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um projeto ou selecione existente
3. Vá em **APIs & Services → Credentials**
4. Clique **"Create Credentials" → "OAuth client ID"**
5. Tipo: **Web Application**
6. **Authorized redirect URIs**: adicione:
   - `https://SEU-DOMINIO/api/auth/callback/google`
7. Copie o **Client ID** e **Client Secret** para as variáveis de ambiente

---

## 🔑 Configurar Pagamento Pix

### Opção A — Mercado Pago
1. Crie conta em [mercadopago.com.br](https://mercadopago.com.br)
2. Vá em **Credenciais → Produção**
3. Copie Access Token para `PIX_API_KEY`
4. Webhook: `https://SEU-DOMINIO/api/pix/webhook`

### Opção B — Asaas
1. Crie conta em [asaas.com](https://asaas.com)
2. Vá em **Integração → API**
3. Copie a chave API

### Opção C — PushinPay
1. Crie conta em [pushinpay.com.br](https://pushinpay.com.br)
2. Gere sua chave API

---

## 🌐 Domínio Personalizado (opcional)

### Com Railway:
1. Vá em **Settings → Domains**
2. Clique **"Custom Domain"**
3. Adicione: `opiumstory.com.br` (ou seu domínio)
4. No registro do domínio, aponte:
   - **CNAME**: para o domínio do Railway

### Com VPS:
1. Instale Nginx como proxy reverso:
```bash
sudo apt install nginx
```
2. Configure:
```nginx
server {
    server_name opiumstory.com.br;
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_borrowed 1;
    }
}
```
3. Instale SSL grátis com Certbot:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d opiumstory.com.br
```

---

## ✅ Checklist Final

- [ ] Código subido para GitHub
- [ ] Conta criada na plataforma de hospedagem
- [ ] PostgreSQL configurado
- [ ] Variáveis de ambiente configuradas
- [ ] Migrações do banco rodadas (`npx prisma db push`)
- [ ] Google OAuth configurado
- [ ] API Pix configurada
- [ ] Site acessível pelo link
- [ ] (Opcional) Domínio personalizado configurado
- [ ] (Opcional) SSL/HTTPS configurado

---

## 🎯 Resumo Rápido (Railway — 5 minutos)

```
1. Subir código → GitHub
2. Railway → New Project → Deploy from GitHub
3. + New → PostgreSQL (automático)
4. Configurar variáveis de ambiente
5. Aguardar deploy (2-3 min)
6. Rodar npx prisma db push no terminal
7. Acessar o link gerado! 🎉
```

Pronto! Sua loja Opium estará online!
