import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const getAll = async ( gimnasioId, params) => {
    const { activo,descripcion,page, limit } = params;

    const skip = (page - 1) * limit;

    let filtros = {};

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
        const rows = await prisma.bloque.findMany(
            {
                where:{
                    AND: [
                        filtros
                    ]
                },
                skip: skip,
                take: limit,
                orderBy: {
                    createdAt: 'desc',
                },
            }
        );

        return rows;
    } catch (error) {
        throw error;
    }
}