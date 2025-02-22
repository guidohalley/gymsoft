// frontend/src/configs/routes.config/routes.config.ts
import { lazy } from 'react'
import authRoute from './authRoute'
import type { Routes } from '@/@types/routes'
import { ADMIN, ENTRENADOR, DUENIO } from '@/constants/roles.constant'

export const publicRoutes: Routes = [...authRoute]

export const protectedRoutes = [
    {
        key: 'home',
        path: '/home',
        component: lazy(() => import('@/views/Home')),
        authority: [ADMIN, ENTRENADOR, DUENIO],
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
        key: 'listado-ejercicios',
        path: '/ejercicios/listado',
        component: lazy(() => import('@/views/ejercicios/ExerciseListPage')),
        authority: [ADMIN, DUENIO],
    },
    {
        key: 'nuevo-ejercicio',
        path: '/ejercicios/nueva',
        component: lazy(() => import('@/views/ejercicios/ExerciseFormPage')),
        authority: [ADMIN, DUENIO],
    },
    {
        key: 'detalle-ejercicio',
        path: '/ejercicios/:id',
        component: lazy(() => import('@/views/ejercicios/ExerciseDetailPage')),
        authority: [ADMIN, DUENIO],
    },
    {
        key: 'editar-ejercicio',
        path: '/ejercicios/editar/:id',
        component: lazy(() => import('@/views/ejercicios/ExerciseFormPage')),
        authority: [ADMIN, DUENIO],
    },    
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
        path: '/bloques/nueva',
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
        key: 'dispositivos-nuevo',
        path: '/dispositivos/nuevo',
        component: lazy(() => import('@/views/dispositivos/DeviceNewPage')),
        authority: [DUENIO],
    },
    {
        key: 'dispositivos-editar',
        path: '/dispositivos/editar/:id',
        component: lazy(() => import('@/views/dispositivos/DeviceNewPage')),
        authority: [DUENIO],
    },
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
    {
        key: 'nueva-rutina',
        path: '/rutinas/nueva',
        component: lazy(() => import('@/views/rutinas/RutinaFormPage')),
        authority: [ADMIN, ENTRENADOR, DUENIO],
    },
    {
        key: 'detalle-rutina',
        path: '/rutinas/:id',
        component: lazy(() => import('@/views/rutinas/RutinaDetailPage')),
        authority: [ADMIN, ENTRENADOR, DUENIO],
    },
    {
        key: 'editar-rutina',
        path: '/rutinas/editar/:id',
        component: lazy(() => import('@/views/rutinas/RutinaFormPage')),
        authority: [ADMIN, ENTRENADOR, DUENIO],
    },
    {
        key: 'clases-listado',
        path: '/clases/listado',
        component: lazy(() => import('@/views/clases/ClasesListPage')),
        authority: [ADMIN, ENTRENADOR, DUENIO],
    },
    {
        key: 'clase-detalle',
        path: '/clases/:id',
        component: lazy(() => import('@/views/clases/ClaseDetailPage')),
        authority: [ADMIN, ENTRENADOR, DUENIO],
    },
    {
        key: 'clase-nueva',
        path: '/clases/nueva',
        component: lazy(() => import('@/views/clases/ClaseForm')),
        authority: [ADMIN, ENTRENADOR, DUENIO],
    },
    {
        key: 'clase-editar',
        path: '/clases/:id/editar',
        component: lazy(() => import('@/views/clases/ClaseForm')),
        authority: [ADMIN, ENTRENADOR, DUENIO],
    },
    {
        key: 'tiposDeClases',
        path: '/clases/tipo/listado',
        component: lazy(() => import('@/views/tiposDeClases/TiposDeClasesListPage')),
        authority: [ADMIN, DUENIO],
    },
    {
        key: 'nuevoTipoClase',
        path: '/clases/tipo/nuevo',
        component: lazy(() => import('@/views/tiposDeClases/TipoClaseFormPage')),
        authority: [ADMIN, DUENIO],
    },
    {
        key: 'editarTipoClase',
        path: '/clases/tipo/:id/editar',
        component: lazy(() => import('@/views/tiposDeClases/TipoClaseFormPage')),
        authority: [ADMIN, DUENIO],
    },
]
