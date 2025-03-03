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
# Copiar los archivos generados (asumiendo que el output está en la carpeta "dist")
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponer el puerto en el que nginx servirá la aplicación
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
