// src/services/RutinasService.ts
import ApiService from './ApiService';

interface Rutina {
    id: number;
    nombre: string;
    descripcion: string;
    estadoId: number;
    activo: boolean;
    creadoPor: number;
    gimnasioId: number | null;
    createdAt: string;
    updatedAt: string;
}

// **Obtener todas las rutinas**
export async function apiGetRutinas() {
    return ApiService.fetchData<Rutina[], void>({
        url: '/rutinas',
        method: 'get',
    });
}

// **Crear una nueva rutina**
export async function apiCreateRutina(data: Partial<Rutina>) {
    return ApiService.fetchData<Rutina, Partial<Rutina>>({
        url: '/rutinas',
        method: 'post',
        data,
    });
}

// **Obtener detalles de una rutina**
export async function apiGetRutinaDetails(id: number) {
    return ApiService.fetchData<Rutina, void>({
        url: `/rutinas/${id}`,
        method: 'get',
    });
}

// **Actualizar una rutina**
export async function apiUpdateRutina(data: { id: number; [key: string]: any }) {
    return ApiService.fetchData<void, Partial<Rutina>>({
        url: `/rutinas/${data.id}`,
        method: 'put',
        data,
    });
}

// **Eliminar una rutina**
export async function apiDeleteRutina(id: number) {
    return ApiService.fetchData<void, void>({
        url: `/rutinas/${id}`,
        method: 'delete',
    });
}

// **Agregar bloques a una rutina**
export async function apiAddBloquesToRutina(rutinaId: number, bloques: { id: number; orden: number; series: string; descanso: string }[]) {
    return ApiService.fetchData<void, { bloques: { id: number; orden: number; series: string; descanso: string }[] }>({
        url: `/rutinas/${rutinaId}/bloques`,
        method: 'post',
        data: { bloques },
    });
}

// **Obtener los bloques de una rutina**
export async function apiGetBloquesByRutina(rutinaId: number) {
    return ApiService.fetchData<any[], void>({
        url: `/rutinas/${rutinaId}/bloques`,
        method: 'get',
    });
}

// **Eliminar bloques de una rutina**
export async function apiRemoveBloquesFromRutina(rutinaId: number, bloquesId: number[]) {
    return ApiService.fetchData<void, { bloquesId: number[] }>({
        url: `/rutinas/${rutinaId}/bloques`,
        method: 'delete',
        data: { bloquesId },
    });
}

export default {
    apiGetRutinas,
    apiCreateRutina,
    apiGetRutinaDetails,
    apiUpdateRutina,
    apiDeleteRutina,
    apiAddBloquesToRutina,
    apiGetBloquesByRutina,
    apiRemoveBloquesFromRutina,
};
