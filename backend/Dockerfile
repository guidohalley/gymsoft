# Usar una imagen base de Node.js
FROM node:20.17-alpine

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar los archivos de package.json y package-lock.json
COPY package.json package-lock.json ./

# Instalar las dependencias
RUN npm install
RUN npm install -g nodemon

# Copiar el resto del código de la aplicación
COPY . .

# Exponer el puerto de la API
EXPOSE 5000

# Comando para iniciar el servidor
CMD ["nodemon", "server.js"]
