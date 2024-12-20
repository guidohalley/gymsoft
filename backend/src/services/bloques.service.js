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

export const asociarBloquesEjercicios = async (data) => {
    try {
        const ejercicios = await prisma.bloqueEjercicio.createMany({ data });

        return ejercicios;
    } catch (error) {
        throw error;
    }
}

export const getAllBloqueEjercicios = async (bloqueId) => {
    try {
        const ejercicios = await prisma.bloqueEjercicio.findMany({
            where: {
                bloqueId: Number(bloqueId),
            },
            include: {
                ejercicio: true,
            },
        });

        return ejercicios;
    } catch (error) {
        throw error;
    }
}

export const getBloqueEjercicioById = async (bloqueId,ejercicioId) => {
    try {
        const ejercicios = await prisma.bloqueEjercicio.findFirst({
            where: {
                bloqueId: Number(bloqueId),
                ejercicioId: Number(ejercicioId),
            },
            include:{
                ejercicio: true,
            }
        });

        return ejercicios;
    } catch (error) {
        throw error;
    }
}

export const updateBloqueEjercicio = async (bloqueId, ejercicioId,data) => {
    try {
        const updatedRows = await prisma.bloqueEjercicio.update(
            {
                where: {
                    ejercicioId_bloqueId: {
                        bloqueId: Number(bloqueId),
                        ejercicioId: Number(ejercicioId),
                    }
                },
                data
            }
        );

        return updatedRows;
    } catch (error) {
        console.log(error,'error');
        throw error;
    }
}


export const deleteBloqueEjercicioById = async (bloqueId,ejercicioId) => {
    try {
        const ejercicios = await prisma.bloqueEjercicio.deleteMany({
            where: {
                bloqueId: Number(bloqueId),
                ejercicioId: Number(ejercicioId),
            },
        });

        return ejercicios;
    } catch (error) {
        throw error;
    }
}