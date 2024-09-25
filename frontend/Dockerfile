# Usar una imagen base de Node.js
FROM node:20.17-alpine

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar los archivos de package.json y package-lock.json
COPY package*.json ./

# Instalar las dependencias de producción (sin las devDependencies)
RUN npm install

# Copiar el resto del código de la aplicación
COPY . .


EXPOSE 5173

#Establece el comando por defecto para iniciar Vite en modo desarrollo
CMD ["npm", "run",  "dev"]
