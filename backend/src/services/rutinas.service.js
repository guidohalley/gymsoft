import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const getAll = async (gimnasioId, params) => {
    const { nombre,descripcion,activo,page, limit } = params;

    const skip = (page - 1) * limit;

    let filtros = {};

    if (nombre) {
        filtros.nombre = {
            contains: nombre,
            mode: 'insensitive',
        };
    }

    if (descripcion) {
        filtros.descripcion = {
            contains: descripcion,
            mode: 'insensitive',
        };
    }

    if (activo !== undefined) {
        filtros.activo = activo;
    }

    filtros.gimnasioId = gimnasioId;

    try {
        const rows = await prisma.rutina.findMany(
            {
                where:{
                    AND: [
                        filtros
                    ]
                },
                skip: skip,
                take: limit,
                orderBy: {
                    id: 'desc',
                },
            }
        );

        return rows;
    } catch (error) {
        throw error;
    }
}

export const getAllBloques = async (rutinaId) => {
    try {
        const bloques = await prisma.bloque.findMany({
            where: {
                rutinaBloques: {
                    some: { rutinaId: rutinaId }
                }
            },
            select: {
                id: true,
                descripcion: true,
                activo: true,
                orden: true,
                series: true,
                descanso: true,
                creadoPor: true,
                gimnasioId: true,
                createdAt: true,
                updatedAt: true
            }
        });

        return bloques;
    } catch (error) {
        throw error;
    }
};

export const asociarBloques = async (rutinaId,bloquesId) => {
    try {
        const bloquesInsertados = await prisma.rutinaBloques.createMany({
            data: bloquesId.map(bloque => {
                return {
                    bloqueId: bloque,
                    rutinaId: rutinaId
                }
            })
        });

        return bloquesInsertados;
    } catch (error) {
        throw error;
    }
}

export const desasociarBloques = async (rutinaId,bloquesId) => {
    try {
        const bloquesEliminados = await prisma.rutinaBloques.deleteMany({
            where: {
                AND: [
                    {
                        rutinaId: rutinaId
                    },
                    {
                        bloqueId: {
                            in: bloquesId
                        }
                    }
                ]
            }
        });

        return bloquesEliminados;
    } catch (error) {
        throw error;
    }
}