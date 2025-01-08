import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_ITEM,
    NAV_ITEM_TYPE_COLLAPSE
} from '@/constants/navigation.constant'
import type { NavigationTree } from '@/@types/navigation'
import {ADMIN,DUENIO,ENTRENADOR} from '@/constants/roles.constant';

const navigationConfig: NavigationTree[] = [
    {
        key: 'home',
        path: '/home',
        title: 'Home',
        translateKey: 'nav.home',
        icon: 'home',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },
    {
        key: 'ajustes',
        path: '/ajustes',
        title: 'Ajustes',
        translateKey: 'nav.ajustes',
        icon: 'ajustes',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [ADMIN,DUENIO],
        subMenu: [
        {
            key: 'tiposDeClases',
            path: '/ajustes/tipos-de-clases',
            title: 'Tipos de clases ',
            translateKey: 'nav.tiposDeClases',
            icon: '',
            type: NAV_ITEM_TYPE_ITEM,
            authority: [ADMIN,DUENIO],
            subMenu: [],
        }]
    },
    {
        key: 'categoriaEjercicios',
        path: '/categorias-ejercicios',
        title: 'Categoria de Ejercicios',
        translateKey: 'nav.categoriasEjercicios',
        icon: 'exercise',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [ADMIN,DUENIO],
        subMenu: [],
    },
    {
        key: 'musculos',
        path: '/musculos',
        title: 'Musculos',
        translateKey: 'nav.musculos',
        icon: 'musculos',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },
    {
        key: 'ejercicios',
        path: '/ejercicios',
        title: 'Ejercicios',
        translateKey: 'nav.ejercicios',
        icon: 'exercise',
        type: NAV_ITEM_TYPE_COLLAPSE, // Cambiado a COLLAPSE para incluir submenús
        authority: [ADMIN, DUENIO],
        subMenu: [
            {
                key: 'listado-ejercicios',
                path: '/ejercicios/listado',
                title: 'Listado de Ejercicios',
                translateKey: 'nav.listadoEjercicios',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN, DUENIO],
                subMenu: [],
            },
            {
                key: 'nuevo-ejercicio',
                path: '/ejercicios/nuevo',
                title: 'Nuevo Ejercicio',
                translateKey: 'nav.nuevoEjercicio',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN, DUENIO],
                subMenu: [],
            },
        ],
    },
]

export default navigationConfig
