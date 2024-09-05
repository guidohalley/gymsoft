import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const create = async (model, data) => {
    try {
        const newRow = await prisma[model].create({
            data,
            select: {
                id: true
            }
        });

        return newRow;
    } catch (error) {
        throw error;
    }
}

const getAll = async (model, gimnasioId, params) => {
    const { nombre, descripcion,activo,page, limit } = params;

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

    try {
        const rows = await prisma[model].findMany(
            {
                where:{
                    AND: [
                        filtros,
                        {
                            OR: [
                                {esGlobal: true},
                                {gimnasioId: gimnasioId},
                            ]
                        }
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

const getById = async (model, id, gimnasioId) => {
    try {
        const row = await prisma[model].findUnique(
            {
                where: {
                    id: parseInt(id),
                    gimnasioId: gimnasioId
                }
            }
        );

        return row;
    } catch (error) {
        throw error;
    }
}

const update = async (model, id, data) => {
    try {
        const updatedRows = await prisma[model].update(
            {
                where: {
                    id: parseInt(id)
                },
                data,
                select: {
                    id: true
                }
            }
        );

        return updatedRows;
    } catch (error) {
        throw error;
    }
}


export default {
    getAll,
    getById,
    update,
    create
}