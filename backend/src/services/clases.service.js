import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const getAll = async (model, gimnasioId, params) => {
    const { descripcion,activo,page, limit } = params;

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
        const rows = await prisma[model].findMany(
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

export const getRutina = async (claseId) =>{
    try {
        const rutinas = await prisma.clase.findUnique({
            where: { id: parseInt(claseId) },
            select: {
                id: true,
                descripcion:true,
                activo:true,
                fechaInicio:true,
                fechaFin:true,
                rutina: {
                    select: {
                        id: true, 
                        nombre: true,
                        descripcion: true,
                        estado:{
                            select:{
                                estado:true
                            }
                        },
                        rutinaBloques: { // Usa select/include dentro de rutinaBloques
                            select: {
                                bloqueId:true,
                                orden:true,
                                series:true,
                                descanso:true,
                                bloque: {
                                    select: {
                                        id: true,
                                        descripcion: true,
                                        activo: true,
                                        bloquesEjercicios: {
                                            include: {
                                                ejercicio: {
                                                    select: {
                                                        id: true,
                                                        nombre: true,
                                                        descripcion: true,
                                                        url: true,
                                                        categoriaEjercicio: { // Relación con la categoría
                                                            select: {
                                                                nombre: true, // Solo seleccionamos el nombre de la categoría
                                                            },
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        return rutinas;
    } catch (error) {
        console.log(error);
        throw new error;
    }
}