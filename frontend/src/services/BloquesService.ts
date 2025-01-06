import ApiService from './ApiService';

interface Bloque {
    id: number;
    nombre: string;
    descripcion: string;
    orden: number;
    creadoPor: number;
    gimnasioId: number | null;
    createdAt: string;
    updatedAt: string;
}

// Obtener todos los bloques
export async function getBloques() {
    return ApiService.fetchData<Bloque[], void>({
        url: '/bloques-ejercicios',
        method: 'get',
    });
}

// Crear un nuevo bloque
export async function addBloque(data: Bloque) {
    return ApiService.fetchData<Bloque, Bloque>({
        url: '/bloques-ejercicios',
        method: 'post',
        data,
    });
}

// Actualizar un bloque por ID
export async function updateBloque(id: number, data: Partial<Bloque>) {
    return ApiService.fetchData<Bloque, Partial<Bloque>>({
        url: `/bloques-ejercicios/${id}`,
        method: 'put',
        data,
    });
}

//  Eliminar un bloque por ID
export async function deleteBloque(id: number) {
    return ApiService.fetchData<void, void>({
        url: `/bloques-ejercicios/${id}`,
        method: 'delete',
    });
}
// Obtener un bloque por ID
export async function getBloqueById(id: number) {
    return ApiService.fetchData({
        url: `/bloques-ejercicios/${id}`,
        method: 'get',
    });
}

// Obtener todos los ejercicios de un bloque
export async function deleteEjercicioFromBloque(bloqueId: number, ejercicioId: number) {
    return ApiService.fetchData({
        url: `/bloques-ejercicios/${bloqueId}/ejercicios/${ejercicioId}`,
        method: 'delete',
    });
}

