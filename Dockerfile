# ---- build stage ----
FROM node:20-alpine AS build
WORKDIR /app

# copiar apenas os arquivos de dependência primeiro para aproveitar cache
COPY package.json package-lock.json ./
RUN npm ci

# copiar restante do código e gerar build
COPY . .
RUN npm run build

# ---- runtime stage ----
FROM nginx:alpine

# rótulos (boa prática para versionamento e rastreabilidade)
LABEL org.opencontainers.image.title="whatsflow-simulator" \
      org.opencontainers.image.description="Simulador WhatsFlow - frontend em Vite" \
      org.opencontainers.image.authors="dchesque" \
      org.opencontainers.image.version="1.0.0" \
      org.opencontainers.image.created="${BUILD_DATE:-unknown}" \
      org.opencontainers.image.revision="${GIT_SHA:-unknown}"

# copiar arquivos estáticos construídos
COPY --from=build /app/dist /usr/share/nginx/html

# sobrescrever configuração do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# healthcheck para garantir que o container esteja servindo
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://localhost/ || exit 1
