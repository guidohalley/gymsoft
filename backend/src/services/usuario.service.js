import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const findByEmailLogin = async (email) => {
    const usuario = await prisma.usuario.findFirst({
        where: {
            email
        },
        select:{
            id:true,
            nombre:true,
            apellido:true,
            email:true,
            password:true,
            activo:true,
            gimnasioId:true,
            rol:{
                select:{
                    nombre:true
                }
            }
        }

    });
    return usuario;
}

export default {
    findByEmailLogin
}