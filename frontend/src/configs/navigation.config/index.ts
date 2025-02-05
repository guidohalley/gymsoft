import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_ITEM,
    NAV_ITEM_TYPE_COLLAPSE
} from '@/constants/navigation.constant';;
import type { NavigationTree } from '@/@types/navigation';;
import {  ADMIN,  DUENIO,  ENTRENADOR  } from '@/constants/roles.constant';

const navigationConfig: NavigationTree[] = [
    {
        key: 'home',
        path: '/home',
        title: '🏠 Home',
        translateKey: 'nav.home',
        icon: 'home',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },
    {
        key: 'ajustes',
        path: '/ajustes',
        title: '⚙️ Ajustes',
        translateKey: 'nav.ajustes',
        icon: 'settings',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [ADMIN,  DUENIO],
        subMenu: [
            {
                key: 'tiposDeClases',
                path: '/ajustes/tipos-de-clases',
                title: '📌 Tipos de Clases',
                translateKey: 'nav.tiposDeClases',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN, DUENIO],
                subMenu: [],
            },
        ],
    },
    {
        key: 'ejercicios',
        path: '/ejercicios',
        title: '🏋️ Ejercicios',
        translateKey: 'nav.ejercicios',
        icon: 'exercise',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [ADMIN, DUENIO],
        subMenu: [
            {
                key: 'listado-ejercicios',
                path: '/ejercicios/listado',
                title: '📋 Listado de Ejercicios',
                translateKey: 'nav.listadoEjercicios',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN, DUENIO],
                subMenu: [],
            },
            {
                key: 'nuevo-ejercicio',
                path: '/ejercicios/nuevo',
                title: '➕ Nuevo Ejercicio',
                translateKey: 'nav.nuevoEjercicio',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN, DUENIO],
                subMenu: [],
            },
        ],
    },
    {
        key: 'rutinas',
        path: '/rutinas',
        title: '📆 Rutinas',
        translateKey: 'nav.rutinas',
        icon: 'calendar',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [ADMIN, ENTRENADOR, DUENIO],
        subMenu: [
            {
                key: 'listado-rutinas',
                path: '/rutinas/listado',
                title: '📋 Listado de Rutinas',
                translateKey: 'nav.listadoRutinas',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN, ENTRENADOR, DUENIO],
                subMenu: [],
            },
            {
                key: 'nueva-rutina',
                path: '/rutinas/nueva',
                title: '➕ Nueva Rutina',
                translateKey: 'nav.nuevaRutina',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN, ENTRENADOR, DUENIO],
                subMenu: [],
            },
        ],
    },
        //  Nueva entrada: Bloques de Ejercicios
    {
        key: 'bloquesEjercicios',
        path: '/bloques',
        title: 'Bloques',
        translateKey: 'nav.bloquesEjercicios',
        icon: 'bloques',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [ADMIN, DUENIO, ENTRENADOR],
        subMenu: [],
    },
    {
        key: 'dispositivos',
        path: '/dispositivos',
        title: '📺 Dispositivos',
        translateKey: 'nav.dispositivos',
        icon: 'exercise',
        type: NAV_ITEM_TYPE_ITEM, // Cambiado a COLLAPSE para incluir submenús
        authority: [DUENIO],
        subMenu: [],
    },
];

export default navigationConfig;
