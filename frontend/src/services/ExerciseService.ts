// src/services/exerciseService.ts
import ApiService from './ApiService';

interface Ejercicio {
    id: number;
    nombre: string;
    categoria: string;
    descripcion: string;
    estado: string;
    video: string | null; // URL o nombre del archivo del video, o null si no hay video
    creadoPor: number;
    gimnasioId: number | null;
    createdAt: string;
    updatedAt: string;
}

// Función para obtener todos los ejercicios
export async function apiGetEjercicios() {
    return ApiService.fetchData<Ejercicio[], void>({
        url: '/ejercicios',
        method: 'get',
    });
}

// Función para crear un nuevo ejercicio
export async function apiCreateEjercicio(data: Partial<Ejercicio>) {
    return ApiService.fetchData<Ejercicio, Partial<Ejercicio>>({
        url: '/ejercicios',
        method: 'post',
        data,
    });
}

// Función para eliminar un ejercicio
export async function apiDeleteEjercicio(id: number) {
    return ApiService.fetchData<void, void>({
        url: `/ejercicios/${id}`,
        method: 'delete',
    });
}

// Función para obtener detalles de un ejercicio
export async function apiGetEjercicioDetails(id: number) {
    return ApiService.fetchData<Ejercicio, void>({
        url: `/ejercicios/${id}`,
        method: 'get',
    });
}

// Función para actualizar un ejercicio
export async function apiUpdateEjercicio(id: number, data: Partial<Ejercicio>) {
    return ApiService.fetchData<Ejercicio, Partial<Ejercicio>>({
        url: `/ejercicios/${id}`,
        method: 'put',
        data,
    });
}

export default {
    apiGetEjercicios,
    apiCreateEjercicio,
    apiDeleteEjercicio,
    apiGetEjercicioDetails,
    apiUpdateEjercicio,
};
