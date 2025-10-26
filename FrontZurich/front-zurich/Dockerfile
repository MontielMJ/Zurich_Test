# ================================
# Etapa 1: Build Angular
# ================================
FROM node:20-alpine AS build
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./
RUN npm ci --silent

# Copiar todo el código fuente
COPY . .

# Build de Angular en modo producción
RUN npm run build --prod

# ================================
# Etapa 2: Servir con NGINX
# ================================
FROM nginx:alpine

# Copiar los archivos generados de Angular
COPY --from=build /app/dist/front-zurich /usr/share/nginx/html

# Configuración Nginx para SPA
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto
EXPOSE 8080

# Healthcheck del contenedor
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:8080/ || exit 1

# Comando para mantener Nginx corriendo
CMD ["nginx", "-g", "daemon off;"]
