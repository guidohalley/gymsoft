import { lazy } from 'react'
import authRoute from './authRoute'
import type { Routes } from '@/@types/routes'

export const publicRoutes: Routes = [...authRoute]
import {ADMIN,ENTRENADOR,DUENIO} from '@/constants/roles.constant';
import path from 'path';

export const protectedRoutes = [
    {
        key: 'home',
        path: '/home',
        component: lazy(() => import('@/views/Home')),
        authority: [ADMIN,ENTRENADOR,DUENIO],
    },
    {
        key: 'tiposDeClases',
        path: '/ajustes/tipos-de-clases',
        component: lazy(() => import('@/views/ajustes/TiposDeClases')),
        authority: [ADMIN,DUENIO],
    },
    {
        key: 'categoriasEjercicios',
        path: '/categorias-ejercicios',
        component: lazy(() => import('@/views/categorias/Categorias')),
        authority: [ADMIN,DUENIO],
    },
    {
        key: 'musculos',
        path: '/musculos',
        component: lazy(() => import('@/views/musculos')),
        authority: [ADMIN,DUENIO],
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

]