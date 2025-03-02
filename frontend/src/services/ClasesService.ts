import ApiService from './ApiService';
import { IClase } from '@/types/clases';

// Función para obtener todas las clases
export async function apiGetClases() {
    return ApiService.fetchData<IClase[], void>({
        url: '/clases?activo=true',
        method: 'get',
    });
}

// Función para obtener los datos de una clase por su ID
export async function apiGetClaseById(id: number) {
    return ApiService.fetchData<IClase, void>({
        url: `/clases/${id}`,
        method: 'get',
    });
}

// Función para crear una nueva clase
export async function apiCreateClase(data: IClase) {
    return ApiService.fetchData<IClase, IClase>({
        url: '/clases',
        method: 'post',
        data,
    });
}

// Función para actualizar una clase existente
export async function apiUpdateClase(id: number, data: Partial<IClase>) {
    return ApiService.fetchData<void, Partial<IClase>>({
        url: `/clases/${id}`,
        method: 'put',
        data,
    });
}

// Función para eliminar una clase
export async function apiDeleteClase(id: number) {
    return ApiService.fetchData<void, void>({
        url: `/clases/${id}`,
        method: 'delete',
    });
}

// Función para obtener la rutina de una clase por su ID
export async function apiGetClaseRutina(id: number) {
    return ApiService.fetchData<IClase, void>({
        url: `/clases/${id}/rutina`,
        method: 'get',
    });
}

export default {
    apiGetClases,
    apiGetClaseById,
    apiCreateClase,
    apiUpdateClase,
    apiDeleteClase,
    apiGetClaseRutina,
};