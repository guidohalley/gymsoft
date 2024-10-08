-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" VARCHAR(128),
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "nombre" VARCHAR(128) NOT NULL,
    "apellido" VARCHAR(128) NOT NULL,
    "nro_telefono" VARCHAR(20) NOT NULL,
    "direccion" VARCHAR(255) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "password" VARCHAR(255) NOT NULL,
    "gimnasio_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "rol_id" INTEGER NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gimnasios" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(128) NOT NULL,
    "direccion" VARCHAR(255) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gimnasios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categorias_ejercicios" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(128) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "es_global" BOOLEAN NOT NULL DEFAULT true,
    "creado_por" INTEGER,
    "gimnasio_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categorias_ejercicios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "musculos" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(128) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "es_global" BOOLEAN NOT NULL DEFAULT true,
    "creado_por" INTEGER,
    "gimnasio_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "musculos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ejercicios_musculos" (
    "ejercicio_id" INTEGER NOT NULL,
    "musculo_id" INTEGER NOT NULL,

    CONSTRAINT "ejercicios_musculos_pkey" PRIMARY KEY ("ejercicio_id","musculo_id")
);

-- CreateTable
CREATE TABLE "ejercicios" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(128) NOT NULL,
    "descripcion" VARCHAR(255) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "categoria_ejercicio_id" INTEGER NOT NULL,
    "es_global" BOOLEAN NOT NULL DEFAULT true,
    "creado_por" INTEGER,
    "gimnasio_id" INTEGER,
    "path" VARCHAR(255),
    "url" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ejercicios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estados_rutinas" (
    "id" SERIAL NOT NULL,
    "estado" VARCHAR(128) NOT NULL,

    CONSTRAINT "estados_rutinas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rutinas" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(128) NOT NULL,
    "descripcion" VARCHAR(255) NOT NULL,
    "estado_id" INTEGER NOT NULL,
    "creado_por" INTEGER,
    "gimnasio_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "claseId" INTEGER,

    CONSTRAINT "rutinas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bloques_ejercicios" (
    "ejercicio_id" INTEGER NOT NULL,
    "bloque_id" INTEGER NOT NULL,
    "orden" INTEGER NOT NULL,
    "repeticiones" VARCHAR(128),
    "series" INTEGER,
    "descanso" INTEGER,
    "peso" INTEGER,

    CONSTRAINT "bloques_ejercicios_pkey" PRIMARY KEY ("ejercicio_id","bloque_id")
);

-- CreateTable
CREATE TABLE "dispositivos" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(128) NOT NULL,
    "descripcion" VARCHAR(255) NOT NULL,
    "gimnasio_id" INTEGER NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dispositivos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clases_dispositivos" (
    "clase_id" INTEGER NOT NULL,
    "dispositivo_id" INTEGER NOT NULL,
    "fecha_inicio" TIMESTAMP(3) NOT NULL,
    "fecha_fin" TIMESTAMP(3) NOT NULL,
    "orden" INTEGER NOT NULL,

    CONSTRAINT "clases_dispositivos_pkey" PRIMARY KEY ("clase_id","dispositivo_id")
);

-- CreateTable
CREATE TABLE "tipos_clases" (
    "id" SERIAL NOT NULL,
    "descripcion" VARCHAR(128) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "es_global" BOOLEAN NOT NULL DEFAULT true,
    "creado_por" INTEGER,
    "gimnasio_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tipos_clases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clases" (
    "id" SERIAL NOT NULL,
    "descripcion" VARCHAR(128) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fecha_inicio" DATE NOT NULL,
    "fecha_fin" DATE NOT NULL,
    "tipo_clase_id" INTEGER NOT NULL,
    "gimnasio_id" INTEGER NOT NULL,
    "creado_por" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bloques" (
    "id" SERIAL NOT NULL,
    "descripcion" VARCHAR(128) NOT NULL,
    "series" VARCHAR(128),
    "descanso" VARCHAR(128),
    "rutina_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bloques_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "otps" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "codigo" VARCHAR(6) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fecha_expiracion" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "otps_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_nombre_key" ON "roles"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "rutinas_claseId_key" ON "rutinas"("claseId");

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_gimnasio_id_fkey" FOREIGN KEY ("gimnasio_id") REFERENCES "gimnasios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categorias_ejercicios" ADD CONSTRAINT "categorias_ejercicios_creado_por_fkey" FOREIGN KEY ("creado_por") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categorias_ejercicios" ADD CONSTRAINT "categorias_ejercicios_gimnasio_id_fkey" FOREIGN KEY ("gimnasio_id") REFERENCES "gimnasios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "musculos" ADD CONSTRAINT "musculos_creado_por_fkey" FOREIGN KEY ("creado_por") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "musculos" ADD CONSTRAINT "musculos_gimnasio_id_fkey" FOREIGN KEY ("gimnasio_id") REFERENCES "gimnasios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ejercicios_musculos" ADD CONSTRAINT "ejercicios_musculos_ejercicio_id_fkey" FOREIGN KEY ("ejercicio_id") REFERENCES "ejercicios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ejercicios_musculos" ADD CONSTRAINT "ejercicios_musculos_musculo_id_fkey" FOREIGN KEY ("musculo_id") REFERENCES "musculos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ejercicios" ADD CONSTRAINT "ejercicios_categoria_ejercicio_id_fkey" FOREIGN KEY ("categoria_ejercicio_id") REFERENCES "categorias_ejercicios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ejercicios" ADD CONSTRAINT "ejercicios_creado_por_fkey" FOREIGN KEY ("creado_por") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ejercicios" ADD CONSTRAINT "ejercicios_gimnasio_id_fkey" FOREIGN KEY ("gimnasio_id") REFERENCES "gimnasios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rutinas" ADD CONSTRAINT "rutinas_estado_id_fkey" FOREIGN KEY ("estado_id") REFERENCES "estados_rutinas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rutinas" ADD CONSTRAINT "rutinas_claseId_fkey" FOREIGN KEY ("claseId") REFERENCES "clases"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rutinas" ADD CONSTRAINT "rutinas_creado_por_fkey" FOREIGN KEY ("creado_por") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rutinas" ADD CONSTRAINT "rutinas_gimnasio_id_fkey" FOREIGN KEY ("gimnasio_id") REFERENCES "gimnasios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bloques_ejercicios" ADD CONSTRAINT "bloques_ejercicios_ejercicio_id_fkey" FOREIGN KEY ("ejercicio_id") REFERENCES "ejercicios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bloques_ejercicios" ADD CONSTRAINT "bloques_ejercicios_bloque_id_fkey" FOREIGN KEY ("bloque_id") REFERENCES "bloques"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dispositivos" ADD CONSTRAINT "dispositivos_gimnasio_id_fkey" FOREIGN KEY ("gimnasio_id") REFERENCES "gimnasios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clases_dispositivos" ADD CONSTRAINT "clases_dispositivos_clase_id_fkey" FOREIGN KEY ("clase_id") REFERENCES "clases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clases_dispositivos" ADD CONSTRAINT "clases_dispositivos_dispositivo_id_fkey" FOREIGN KEY ("dispositivo_id") REFERENCES "dispositivos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tipos_clases" ADD CONSTRAINT "tipos_clases_creado_por_fkey" FOREIGN KEY ("creado_por") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tipos_clases" ADD CONSTRAINT "tipos_clases_gimnasio_id_fkey" FOREIGN KEY ("gimnasio_id") REFERENCES "gimnasios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clases" ADD CONSTRAINT "clases_gimnasio_id_fkey" FOREIGN KEY ("gimnasio_id") REFERENCES "gimnasios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clases" ADD CONSTRAINT "clases_tipo_clase_id_fkey" FOREIGN KEY ("tipo_clase_id") REFERENCES "tipos_clases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clases" ADD CONSTRAINT "clases_creado_por_fkey" FOREIGN KEY ("creado_por") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bloques" ADD CONSTRAINT "bloques_rutina_id_fkey" FOREIGN KEY ("rutina_id") REFERENCES "rutinas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "otps" ADD CONSTRAINT "otps_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
