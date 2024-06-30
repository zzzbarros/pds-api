# Etapa 1: Construir
FROM node:lts-alpine as build
WORKDIR /usr/src/api

# Copiar arquivos de definição do projeto e instalar dependências
COPY package*.json ./
RUN npm install

# Copiar o restante dos arquivos do projeto
COPY . .

# Copiar o arquivo .env
COPY .env ./.env

# Gerar os artefatos do Prisma
RUN npm run prisma:generate \ && npm run prisma:migrate:deploy

# Construir a aplicação
RUN npm run build

# Etapa 2: Produção
FROM node:lts-alpine
WORKDIR /usr/src/api

# Instalar pm2 globalmente
RUN npm install -g pm2

# Copiar apenas as dependências de produção
COPY --from=build /usr/src/api/package*.json ./
RUN npm ci --only=production

COPY --from=build /usr/src/api/.env ./.env

# Copiar a build da aplicação
COPY --from=build /usr/src/api/dist ./dist

# Copiar os artefatos do Prisma para a pasta correta
COPY --from=build /usr/src/api/node_modules/.prisma ./node_modules/.prisma

# Copiar o arquivo de configuração do PM2
COPY --from=build /usr/src/api/ecosystem.config.js ./

# Configurar timezone
ENV TZ=America/Sao_Paulo
RUN apk add --no-cache openssl procps \
  && ln -snf /usr/share/zoneinfo/$TZ /etc/localtime \
  && echo $TZ > /etc/timezone \
  && apk del --no-cache openssl

# Expor a porta da aplicação
EXPOSE 3000

# Usar pm2 para iniciar a aplicação
CMD ["pm2-runtime", "ecosystem.config.js"]
