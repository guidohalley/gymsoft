# lams-backend

Este proyecto es una API construida con Express y Prisma que utiliza una base de datos Postgres.

## Requisitos

Antes de comenzar, asegúrate de tener instalados los siguientes requisitos:

- **PostgreSQL 16.3**: Base de datos.
- **Node.js v22.2.0** : Entorno de ejecución para JavaScript.

## Configuración del Entorno

1. Copia el archivo de variables de entorno de ejemplo:

```sh
cp .env.dist .env
```

2. Configura las variables de entorno en el archivo `.env` según tus necesidades. Asegúrate de que los valores sean correctos para tu configuración de base de datos y otros parámetros del entorno.

## Instalación de Dependencias

Para instalar todas las dependencias necesarias, ejecuta el siguiente comando:

```sh
npm install
```

## Configuración de la Base de Datos

Para crear el esquema en la base de datos, utiliza Prisma Migrate. Ejecuta el siguiente comando:

```sh
npx prisma migrate dev
```

> La conexion a la base de datos se define en el archivo .env en la variable **DATABASE_URL**.Es importante tener en cuenta que la base de datos debe existir en el servidor de base de datos, por defecto se llama **lams**

Para cargar los datos en la bd adicionales:

```sh
npm run seed
```

Para pruebas usar el seed anterior y adicionalmente test-seed el cual carga dos usuarios 

```sh
npm run test-seed
```

Cargar datos de localidades 
```sh
psql -h localhost -U postgres -d lams -f .\db\countries.sql
psql -h localhost -U postgres -d lams -f .\db\states.sql
psql -h localhost -U postgres -d lams -f .\db\cities.sql
```

Datos de prueba 

| Usuario | Password  | 
|----------|----------|
| lcassettai@sobrelaweb.com    | demo  | 
| rcano@sobrelaweb.com    | demo   | 

> NO CORRER test-seed en produccion

## Iniciar el Servidor
Para comenzar a escuchar el servidor, ejecuta:

```sh
npm start
```

## Prueba de la API
Para verificar que la API esté funcionando correctamente, abre tu navegador y dirígete a la siguiente URL:

http://localhost:3000/api/v1

Deberías recibir la siguiente respuesta:

```json
{
"message": "Api OK"
}
```

