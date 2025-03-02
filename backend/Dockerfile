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

# Asegurar que DATABASE_URL esté disponible antes de correr migraciones
ENV DATABASE_URL=$DATABASE_URL

# Ejecutar migraciones solo si hay cambios pendientes
RUN sh -c 'if npx prisma migrate status | grep -q "Database schema is up to date!"; then echo "No hay migraciones pendientes"; else npx prisma migrate deploy; fi'

# Exponer el puerto de la API
EXPOSE 5000

# Comando para iniciar el servidor en producción
CMD ["node", "server.js"]
