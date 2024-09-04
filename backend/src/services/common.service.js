import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const create = async (model,data) => {
    try {
        const newRow = await prisma[model].create({
            data,
            select:{
                id:true
            }
        });

        return newRow;
    } catch (error) {
        throw error;
    }
}

const getAll = async (model,companyId, params) => {
    const { description, active, page, limit } = params;

    const skip = (page - 1) * limit;

    const filters = {};

    if (description) {
        filters.description = {
            contains: description,
            mode: 'insensitive',
        };
    }

    if (active !== undefined) {
        filters.active = active;
    }

    filters.companyId = companyId;

    try {
        const rows = await prisma[model].findMany(
            {
                where: filters,
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

const getById = async (model,id, companyId) => {
    try {
        const row = await prisma[model].findUnique(
            {
                where: {
                    id: parseInt(id),
                    companyId: companyId
                }
            }
        );

        return row;
    } catch (error) {
        throw error;
    }
}

const update = async (model,id,data) => {
    try {
        const updatedRows = await prisma[model].update(
            {
                where: {
                    id: parseInt(id)
                },
                data
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