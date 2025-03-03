# Etapa de construcción
FROM node:20.17-alpine AS builder
WORKDIR /app

# Copiar archivos de dependencias e instalar
COPY package*.json ./
RUN npm install

# Copiar el resto del código y construir la aplicación
COPY . .
RUN npm run build

# Etapa de producción
FROM nginx:stable-alpine
# Copiar los archivos generados (asumiendo que el output está en "build")
COPY --from=builder /app/build /usr/share/nginx/html

# Copiar la configuración personalizada de nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Exponer el puerto en el que nginx servirá la aplicación
EXPOSE 80

CMD envsubst '$PORT' < /etc/nginx/nginx.conf > /tmp/nginx.conf && mv /tmp/nginx.conf /etc/nginx/nginx.conf && nginx -g 'daemon off;'
