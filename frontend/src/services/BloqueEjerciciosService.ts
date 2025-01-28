// frontend/src/services/BloqueEjerciciosService.ts
import ApiService from './ApiService'

// Interfaz que define los datos del BloqueEjercicio
interface BloqueEjercicio {
    ejercicioId: number
    orden: number
    repeticiones: string
    series: number
    descanso: number
    peso?: number
}

// Crear ejercicios en un bloque específico
export async function apiCreateBloqueEjercicios(
    bloqueId: number,
    ejerciciosFormateados: BloqueEjercicio[],
) {
    return ApiService.fetchData<void, { ejercicios: BloqueEjercicio[] }>({
        url: `/bloques-ejercicios/${bloqueId}`,
        method: 'post',
        data: { ejercicios: ejerciciosFormateados }, // Enviar los ejercicios dentro de un objeto
    });
}

// Obtener todos los ejercicios de un bloque
export async function apiGetEjerciciosByBloque(bloqueId: number) {
    return ApiService.fetchData<{ data: BloqueEjercicio[] }, void>({
        url: `/bloques-ejercicios/${bloqueId}`,
        method: 'get',
    });
}

// Actualizar un ejercicio específico en un bloque
export async function apiUpdateBloqueEjercicio(
    bloqueId: number,
    ejercicioId: number,
    data: Partial<BloqueEjercicio>,
) {
    return ApiService.fetchData<void, Partial<BloqueEjercicio>>({
        url: `/bloques-ejercicios/${bloqueId}/ejercicio/${ejercicioId}`,
        method: 'put',
        data,
    })
}

// Obtener un ejercicio específico de un bloque
export async function apiGetBloqueEjercicioById(
    bloqueId: number,
    ejercicioId: number,
) {
    return ApiService.fetchData<BloqueEjercicio, void>({
        url: `/bloques-ejercicios/${bloqueId}/ejercicio/${ejercicioId}`,
        method: 'get',
    })
}

// Eliminar un ejercicio de un bloque
export async function apiDeleteBloqueEjercicio(
    bloqueId: number,
    ejercicioId: number,
) {
    return ApiService.fetchData<void, void>({
        url: `/bloques-ejercicios/${bloqueId}/ejercicio/${ejercicioId}`,
        method: 'delete',
    })
}

export default {
    apiCreateBloqueEjercicios,
    apiGetEjerciciosByBloque,
    apiUpdateBloqueEjercicio,
    apiGetBloqueEjercicioById,
    apiDeleteBloqueEjercicio,
}
