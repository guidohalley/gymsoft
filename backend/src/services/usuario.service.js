import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const findByEmail = async (email) => {
    const usuario = await prisma.usuario.findFirst({
        where: {
            email
        }
    });
    return usuario;
}

export default {
    findByEmail
}