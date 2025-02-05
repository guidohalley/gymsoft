// frontend/src/configs/routes.config/routes.config.ts
import { lazy } from 'react'
import authRoute from './authRoute'
import type { Routes } from '@/@types/routes'

export const publicRoutes: Routes = [...authRoute]
import { ADMIN, ENTRENADOR, DUENIO } from '@/constants/roles.constant'
import path from 'path'

export const protectedRoutes = [
    {
        key: 'home',
        path: '/home',
        component: lazy(() => import('@/views/Home')),
        authority: [ADMIN, ENTRENADOR, DUENIO],
    },
    {
        key: 'tiposDeClases',
        path: '/ajustes/tipos-de-clases',
        component: lazy(() => import('@/views/ajustes/TiposDeClases')),
        authority: [ADMIN, DUENIO],
    },
    {
        key: 'categoriasEjercicios',
        path: '/categorias-ejercicios',
        component: lazy(() => import('@/views/categorias/Categorias')),
        authority: [ADMIN, DUENIO],
    },
    {
        key: 'musculos',
        path: '/musculos',
        component: lazy(() => import('@/views/musculos')),
        authority: [ADMIN, DUENIO],
    },
    {
        component: lazy(() => import('@/views/ejercicios/ExerciseListPage')), // Ruta principal para ejercicios
        authority: [ADMIN, DUENIO],
    },
    {
        key: 'listado-ejercicios',
        path: '/ejercicios/listado',
        component: lazy(() => import('@/views/ejercicios/ExerciseListPage')), // Ruta para el listado
        authority: [ADMIN, DUENIO],
    },
    {
        key: 'nuevo-ejercicio',
        path: '/ejercicios/nuevo',
        component: lazy(() => import('@/views/ejercicios/ExerciseFormPage')), // Ruta para crear un nuevo ejercicio
        authority: [ADMIN, DUENIO],
    },
    {
        key: 'detalle-ejercicio',
        path: '/ejercicios/:id',
        component: lazy(() => import('@/views/ejercicios/ExerciseDetailPage')), // Ruta para detalles del ejercicio
        authority: [ADMIN, DUENIO],
    },
    {
        key: 'editar-ejercicio',
        path: '/ejercicios/editar/:id',
        component: lazy(() => import('@/views/ejercicios/ExerciseFormPage')), // Reutiliza el formulario para editar
        authority: [ADMIN, DUENIO],
    },
    // ✅ Bloques de ejercicios
    {
        key: 'bloques-list',
        path: '/bloques',
        component: lazy(() => import('@/views/BloquesEjercicios/BloquesListPage')),
        authority: [ADMIN, DUENIO],
    },
    {
        key: 'bloque-detail',
        path: '/bloques/:id',
        component: lazy(() => import('@/views/BloquesEjercicios/BloquesDetailPage')),
        authority: [ADMIN, DUENIO],
    },
    {
        key: 'bloque-new',
        path: '/bloques/nuevo',
        component: lazy(() => import('@/views/BloquesEjercicios/components/BloquesForm')),
        authority: [ADMIN, DUENIO],
    },
    {
        key: 'bloque-edit',
        path: '/bloques/:id/editar',
        component: lazy(() => import('@/views/BloquesEjercicios/components/BloquesForm')),
        authority: [ADMIN, DUENIO],
    },
    {
        key: 'dispositivos',
        path: '/dispositivos',
        component: lazy(() => import('@/views/dispositivos')),
        authority: [DUENIO],
    },
    {
        key: 'dispositivos',
        path: '/dispositivos/nuevo',
        component: lazy(() => import('@/views/dispositivos/DeviceNewPage')),
        authority: [DUENIO],
    },
    {
        key: 'dispositivos',
        path: '/dispositivos/editar/:id',
        component: lazy(() => import('@/views/dispositivos/DeviceNewPage')),
        authority: [DUENIO],
    },
]

    {
        key: 'rutinas',
        path: '/rutinas',
        component: lazy(() => import('@/views/rutinas/RutinaListPage')),
        authority: [ADMIN, ENTRENADOR, DUENIO],
    },
    {
        key: 'listado-rutinas',
        path: '/rutinas/listado',
        component: lazy(() => import('@/views/rutinas/RutinaListPage')),
        authority: [ADMIN, ENTRENADOR, DUENIO],
    },
    // {
    //     key: 'nueva-rutina',
    //     path: '/rutinas/nueva',
    //     component: lazy(() => import('@/views/rutinas/RutinaFormPage')),
    //     authority: [ADMIN, ENTRENADOR, DUENIO],
    // },
    {
        key: 'detalle-rutina',
        path: '/rutinas/:id',
        component: lazy(() => import('@/views/rutinas/RutinaDetailPage')),
        authority: [ADMIN, ENTRENADOR, DUENIO],
    },
    // {
    //     key: 'editar-rutina',
    //     path: '/rutinas/editar/:id',
    //     component: lazy(() => import('@/views/rutinas/RutinaFormPage')),
    //     authority: [ADMIN, ENTRENADOR, DUENIO],
    // },

]