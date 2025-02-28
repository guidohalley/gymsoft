import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const crearRoles = async () => {
  const roles = [
    {id:1, nombre: 'Admin', descripcion: 'Administrador del sistema' },
    {id:2, nombre: 'Dueño', descripcion: 'Dueño del gimnasio' },
    {id:3, nombre: 'Entrenador', descripcion: 'Entrenador del Gym' },
    {id:4, nombre: 'Cliente', descripcion: 'Cliente del Gym' },
    {id:5, nombre: 'Dispositivo', descripcion: 'Dispositivo para mostrar clases' },
  ];

  await prisma.rol.createMany({
    data: roles,
  });

  await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('roles', 'id'), (SELECT MAX(id) FROM "roles"))`;
}

const crearEstadoRutinas = async () => {
  const estadoRutinas = [
    { id:1,estado: 'Activo' },
    { id:2,estado: 'Inactivo' },
    { id:3,estado: 'Borrador' },
  ];

  await prisma.estadoRutina.createMany({
    data: estadoRutinas,
  });
  await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('estados_rutinas', 'id'), (SELECT MAX(id) FROM "estados_rutinas"))`;

}

const crearMusculos = async () => {
  const musculos = [
    {nombre: 'Pectorales' ,"creadoPor":1},
    {nombre: 'Dorsales' ,"creadoPor":1},
    {nombre: 'Bíceps' ,"creadoPor":1},
    {nombre: 'Tríceps' ,"creadoPor":1},
    {nombre: 'Deltoides' ,"creadoPor":1},
    {nombre: 'Trapecio' ,"creadoPor":1},
    {nombre: 'Cuádriceps' ,"creadoPor":1},
    {nombre: 'Isquiotibiales' ,"creadoPor":1},
    {nombre: 'Glúteos' ,"creadoPor":1},
    {nombre: 'Abdominales' ,"creadoPor":1},
    {nombre: 'Gemelos' ,"creadoPor":1},
    {nombre: 'Antebrazos' ,"creadoPor":1},
    {nombre: 'Oblicuos' ,"creadoPor":1},
    {nombre: 'Serrato anterior' ,"creadoPor":1},
    {nombre: 'Erectores espinales',"creadoPor":1}
  ];

  await prisma.musculo.createMany({
    data: musculos,
  });
}

const crearUsuarios = async () => {
  const usuarios = [
    {
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
    {
      "email": "tvneutron@gmail.com",
      "nombre": "TV",
      "apellido": "Neutron",
      "nroTelefono": "",
      "direccion": "",
      "activo": true,
      "password": "$2b$10$a8VEjlLNJ6h0tMi8o6xgnOV7SrhFsvS2oLXtAF6nod8jlVpJwXqHK",
      "gimnasioId": 1,
      "rolId": 5
    },
  ]

  await prisma.usuario.createMany({
    data:usuarios
  })
}

const crearGimnasios = async () => {
  const gimnasios = [
    {"nombre": "NeutronGym","direccion": "Av. Aguado 1684"},
    {"nombre": "Zeus","direccion": "Sarmiento 123"}
  ]

  await prisma.gimnasio.createMany({
    data:gimnasios
  })
}

const crearTipoClase =  async () => {
  const tiposClases = [
    {"descripcion": "Musculacion","creadoPor":1},
    {"descripcion": "Funcional","creadoPor":1},
  ]

  await prisma.tipoClase.createMany({
    data:tiposClases
  })
}

async function main() {
  await prisma.$transaction(async (prisma) => {
    await crearGimnasios(prisma);
    await crearRoles(prisma);
    await crearUsuarios(prisma);
    await crearEstadoRutinas(prisma);
    await crearMusculos(prisma);
    await crearTipoClase(prisma);
  });

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