# Usar la imagen oficial de Node.js
FROM node:14

# Establecer el directorio de trabajo en el contenedor
WORKDIR /app

# Copiar el archivo package.json y package-lock.json al contenedor
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar el resto de la aplicación
COPY . .

# Compilar la aplicación para producción
RUN npm run build

# Usar un servidor web estático para servir los archivos
RUN npm install -g serve
CMD ["serve", "-s", "build"]

# Exponer el puerto en el que la aplicación se ejecutará
EXPOSE 3000
