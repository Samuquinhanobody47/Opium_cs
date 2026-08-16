FROM node:18-alpine

WORKDIR /app

# Instalar dependências
COPY package.json package-lock.json ./
RUN npm ci

# Copiar código-fonte
COPY . .

# Gerar Prisma Client
RUN npx prisma generate

# Build do Next.js
RUN npm run build

# Expor porta
EXPOSE 3000

# Variáveis padrão (substituir no deploy)
ENV NODE_ENV=production
ENV PORT=3000

# Iniciar servidor com Socket.io
CMD ["npx", "tsx", "server.ts"]
