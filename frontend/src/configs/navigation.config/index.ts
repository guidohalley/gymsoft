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
        subMenu: [{
            key: 'musculos',
            path: '/ajustes/musculos',
            title: 'Musculos',
            translateKey: 'nav.musculos',
            icon: '',
            type: NAV_ITEM_TYPE_ITEM,
            authority: [ADMIN,DUENIO],
            subMenu: [],
        },
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
        key: 'Ejercicios',
        path: '/ejercicios',
        title: 'Ejercicios',
        translateKey: 'nav.ejercicios',
        icon: 'dumbbell',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [ADMIN,ENTRENADOR,DUENIO],
        subMenu: [{
            key: 'NuevoEjercicio',
            path: '/ejercicios/NuevoEjercicio',
            title: 'Nuevo Ejercicio',
            translateKey: 'nav.NuevoEjercicio',
            icon: '',
            type: NAV_ITEM_TYPE_ITEM,
            authority: [ADMIN,ENTRENADOR,DUENIO],
            subMenu: [],
        }]
    }
]

export default navigationConfig
