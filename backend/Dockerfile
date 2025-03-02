# Usar una imagen base de Node.js optimizada para producción
FROM node:20.17-alpine

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar los archivos de package.json y package-lock.json
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar el resto del código de la aplicación
COPY . .

# Generar Prisma Client
RUN npx prisma generate

# Exponer el puerto de la API
EXPOSE 5000

# Comando para iniciar el servidor en producción y ejecutar migraciones al inicio
CMD npx prisma migrate deploy && node server.js
