// src/services/exerciseService.ts
import ApiService from './ApiService';

interface Ejercicio {
    id: number;
    nombre: string;
    categoria: string;
    descripcion: string;
    esGlobal: boolean;
    activo: boolean;
    video: string | null; // URL o nombre del archivo del video, o null si no hay video
    creadoPor: number;
    gimnasioId: number | null;
    createdAt: string;
    updatedAt: string;
}

// Función para obtener todos los ejercicios
export async function apiGetEjercicios() {
    return ApiService.fetchData<Ejercicio[], void>({
        url: '/ejercicios?activo=true',
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
export async function apiUpdateEjercicio(id:number, data: FormData) {
    return ApiService.fetchData<void,FormData>({
        url: `/ejercicios/${id}`, // El ID se interpolará correctamente
        method: 'put',
        data: data, // El cuerpo de la solicitud contiene el resto de los valores
    });
}

export default {
    apiGetEjercicios,
    apiCreateEjercicio,
    apiDeleteEjercicio,
    apiGetEjercicioDetails,
    apiUpdateEjercicio,
};
