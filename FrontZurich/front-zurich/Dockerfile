# ================================
# Etapa 1: Build Angular
# ================================
FROM node:20-alpine AS build
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./
RUN npm ci --silent

# Copiar TODO el código fuente (incluyendo la carpeta scripts)
COPY . .

# Verificar que los archivos necesarios existen
RUN ls -la scripts/ && \
    echo "=== Contenido de scripts/ ===" && \
    ls -la scripts/ || echo "No existe carpeta scripts"

# Build de Angular en modo producción (usa el script correcto)
RUN npm run set-env && npm run build:prod

# ================================
# Etapa 2: Servir con NGINX
# ================================
FROM nginx:alpine

# Copiar los archivos generados de Angular
COPY --from=build /app/dist/front-zurich/browser /usr/share/nginx/html

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
