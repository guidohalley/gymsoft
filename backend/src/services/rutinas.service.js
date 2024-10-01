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