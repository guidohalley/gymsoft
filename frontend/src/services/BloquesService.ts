// frontend/src/services/BloquesService.ts
import ApiService from './ApiService';

export interface Bloque {
    id?: number;
    descripcion: string;
    activo: boolean;
    orden: number;
    series?: string;
    descanso?: string;
    creadoPor?: number;
    gimnasioId?: number | null;
    createdAt?: string;
    updatedAt?: string;
    ejercicios?: BloqueEjercicio[];
}

export interface BloqueEjercicio {
    ejercicioId: number;
    orden: number;
    repeticiones: string;
    series: number;
    descanso: number;
    peso?: number;
}

//  Obtener todos los bloques
export async function getBloques() {
    return ApiService.fetchData<Bloque[], void>({
        url: '/bloques?activo=true',
        method: 'get',
    });
}

//  Crear un nuevo bloque
export async function addBloque(data: Partial<Bloque>) {
    return ApiService.fetchData<Bloque, Partial<Bloque>>({
        url: '/bloques',
        method: 'post',
        data,
    });
}

//  Actualizar un bloque por ID
export async function updateBloque(id: number, data: Partial<Bloque>) {
    return ApiService.fetchData<Bloque, Partial<Bloque>>({
        url: `/bloques/${id}`,
        method: 'put',
        data,
    });
}

//  Eliminar un bloque por ID
export async function deleteBloque(id: number) {
    return ApiService.fetchData<void, void>({
        url: `/bloques/${id}`,
        method: 'delete',
    });
}

//  Obtener un bloque por ID
export async function getBloqueById(id: number) {
    return ApiService.fetchData<{ data: Bloque }>({
        url: `/bloques/${id}`,
        method: 'get',
    });
}

//  Eliminar un ejercicio de un bloque
export async function deleteEjercicioFromBloque(bloqueId: number, ejercicioId: number) {
    return ApiService.fetchData<void, void>({
        url: `/bloques-ejercicios/${bloqueId}/ejercicio/${ejercicioId}`, // Confirmado desde la colección
        method: 'delete',
    });
}
