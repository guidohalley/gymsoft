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

export const getRutinasBloques = async (rutinaId) => {
    try {
        const data = await prisma.rutinaBloques.findMany({
            where: {
                rutinaId: rutinaId // Filtrar por ID de la rutina
            },
            include: {
                bloque: {
                    select: {
                        descripcion: true,
                        activo: true
                    }
                }
            },
            orderBy: {
                orden: 'asc' // Ordenar por el campo orden
            }
        });

        // Mapear para estructurar el resultado similar a la consulta SQL
        return data.map(item => ({
            rutina_id: item.rutinaId,
            bloque_id: item.bloqueId,
            orden: item.orden,
            series: item.series,
            descanso: item.descanso,
            descripcion: item.bloque.descripcion,
            activo: item.bloque.activo
        }));
    } catch (error) {
        throw error;
    }
};



export const asociarBloques = async (rutinaId,bloques) => {
    try {
        const bloquesInsertados = await prisma.rutinaBloques.createMany({
            data: bloques.map(bloque => {
                return {
                    bloqueId: bloque.id,
                    rutinaId: rutinaId,
                    series: bloque.series ?? "",
                    orden: bloque.orden ?? 1,
                    descanso: bloque.descanso ?? "60",
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