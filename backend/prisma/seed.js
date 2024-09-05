import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const crearRoles = async () => {
  const roles = [
    { id: 1, nombre: 'Admin', descripcion: 'Administrador del sistema' },
    { id: 2, nombre: 'Dueño', descripcion: 'Dueño del gimnasio' },
    { id: 3, nombre: 'Entrenador', descripcion: 'Entrenador del Gym' },
    { id: 4, nombre: 'Cliente', descripcion: 'Cliente del Gym' },
  ];

  await insertarDatos('Rol', roles);
}

const crearMusculos = () => {
  const musculos = [
    { id: 1, nombre: 'Pectorales' ,"creadoPor":1},
    { id: 2, nombre: 'Dorsales' ,"creadoPor":1},
    { id: 3, nombre: 'Bíceps' ,"creadoPor":1},
    { id: 4, nombre: 'Tríceps' ,"creadoPor":1},
    { id: 5, nombre: 'Deltoides' ,"creadoPor":1},
    { id: 6, nombre: 'Trapecio' ,"creadoPor":1},
    { id: 7, nombre: 'Cuádriceps' ,"creadoPor":1},
    { id: 8, nombre: 'Isquiotibiales' ,"creadoPor":1},
    { id: 9, nombre: 'Glúteos' ,"creadoPor":1},
    { id: 10, nombre: 'Abdominales' ,"creadoPor":1},
    { id: 11, nombre: 'Gemelos' ,"creadoPor":1},
    { id: 12, nombre: 'Antebrazos' ,"creadoPor":1},
    { id: 13, nombre: 'Oblicuos' ,"creadoPor":1},
    { id: 14, nombre: 'Serrato anterior' ,"creadoPor":1},
    { id: 15, nombre: 'Erectores espinales',"creadoPor":1}
  ];

  insertarDatos('Musculo', musculos);
}

const crearUsuarios = async () => {
  const usuarios = [
    {
      "id": 1,
      "email": "admin@gmail.com",
      "nombre": "Admin",
      "apellido": "Admin",
      "nroTelefono": "",
      "direccion": "",
      "activo": true,
      "password": "$2b$10$a8VEjlLNJ6h0tMi8o6xgnOV7SrhFsvS2oLXtAF6nod8jlVpJwXqHK",
      "gimnasioId": null,
      "rolId": 1
    },
    {
      "id": 2,
      "email": "martin@gmail.com",
      "nombre": "Martin",
      "apellido": "Rivas",
      "nroTelefono": "",
      "direccion": "",
      "activo": true,
      "password": "$2b$10$a8VEjlLNJ6h0tMi8o6xgnOV7SrhFsvS2oLXtAF6nod8jlVpJwXqHK",
      "gimnasioId": 1,
      "rolId": 2
    },
    {
      "id": 3,
      "email": "martina@gmail.com",
      "nombre": "Martina",
      "apellido": "Ayrault",
      "nroTelefono": "",
      "direccion": "",
      "activo": true,
      "password": "$2b$10$a8VEjlLNJ6h0tMi8o6xgnOV7SrhFsvS2oLXtAF6nod8jlVpJwXqHK",
      "gimnasioId": 1,
      "rolId": 2
    },
    {
      "id": 4,
      "email": "luciano@gmail.com",
      "nombre": "Luciano",
      "apellido": "Cassettai",
      "nroTelefono": "3764902330",
      "direccion": "Avenida Alem 4618",
      "activo": true,
      "password": "$2b$10$a8VEjlLNJ6h0tMi8o6xgnOV7SrhFsvS2oLXtAF6nod8jlVpJwXqHK",
      "gimnasioId": 2,
      "rolId": 2
    },
    {
      "id": 5,
      "email": "guido@gmail.com",
      "nombre": "Guido",
      "apellido": "Halley",
      "nroTelefono": "3764902330",
      "direccion": "Avenida Alem 4618",
      "activo": true,
      "password": "$2b$10$a8VEjlLNJ6h0tMi8o6xgnOV7SrhFsvS2oLXtAF6nod8jlVpJwXqHK",
      "gimnasioId": 1,
      "rolId": 3
    },
  ]

  await insertarDatos('Usuario', usuarios);
}

const crearGimnasios =  () => {
  const gimnasios = [
    {"id": 1,"nombre": "NeutronGym","direccion": "Av. Aguado 1684"},
    {"id": 2,"nombre": "Zeus","direccion": "Sarmiento 123"}
  ]

  insertarDatos('Gimnasio', gimnasios);
}

const crearTipoClase =  () => {
  const tiposClases = [
    {"id": 1,"descripcion": "Musculacion","creadoPor":1},
    {"id": 2,"descripcion": "Funcional","creadoPor":1},
  ]

  insertarDatos('TipoClase', tiposClases);
}

const insertarDatos = async (modelo, datos) => {
  for (const dato of datos) {
    const datoExistente = await prisma[modelo].findUnique({ where: { id: dato.id } });
    if (!datoExistente) {
      await prisma[modelo].create({
        data: dato
      });
    }
  }
}
async function main() {
  await crearGimnasios();
  await crearRoles();
  await crearUsuarios();
  //await crearMusculos();
  await crearTipoClase();

  console.log('Datos insertados correctamente');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });