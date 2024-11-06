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
        key: 'musculos',
        path: '/ajustes/musculos',
        component: lazy(() => import('@/views/ajustes/Musculos')),
        authority: [ADMIN,DUENIO],
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

]