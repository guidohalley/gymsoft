# Usar una imagen base de Node.js
FROM node:20.17-alpine AS build

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar los archivos de package.json y package-lock.json
COPY package*.json ./

# Instalar TODAS las dependencias (incluidas las de desarrollo)
RUN npm install

# Copiar el resto del código de la aplicación
COPY . .

# Construir el proyecto con Vite
RUN npm run build

# Usar una imagen de Nginx para servir los archivos estáticos
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Exponer el puerto 80 para servir en producción
EXPOSE 80

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
