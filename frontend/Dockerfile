# Usar una imagen base de Node.js
FROM node:20.17-alpine

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

# Eliminar las dependencias de desarrollo para reducir el tamaño de la imagen
RUN npm prune --production

# Instalar un servidor web liviano para servir los archivos estáticos
RUN npm install -g serve

# Exponer el puerto 4173 (Vite usa este puerto en producción)
EXPOSE 4173

# Iniciar el servidor en producción
CMD ["serve", "-s", "dist", "-l", "4173"]
