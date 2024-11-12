// src/services/CategoriaEjerciciosService.ts
import ApiService from './ApiService'

interface Categoria {
    id: number;
    nombre: string;
    esGlobal: boolean;
    creadoPor: number;
    gimnasioId: number | null;
    createdAt: string;
    updatedAt: string;
}

// Función para obtener las categorías
export async function getCategoriasEjercicios() {
    return ApiService.fetchData<Categoria[], void>({
        url: '/categorias-ejercicio?activo=true',
        method: 'get',
    })
}

// Función para agregar una nueva categoría
export async function addCategoriaEjercicio(data: Categoria) {
    return ApiService.fetchData<Categoria, Categoria>({
        url: '/categorias-ejercicio',
        method: 'post',
        data,
    })
}

// Función para eliminar una categoría por ID
export async function deleteCategoriaEjercicio(id: number) {
    return ApiService.fetchData<void, void>({
        url: `/categorias-ejercicio/${id}`,
        method: 'delete',
    });
}

// Función para actualizar una categoría por ID
export async function updateCategoriaEjercicio(id: number, data: Partial<Categoria>) {
    return ApiService.fetchData<Categoria, Partial<Categoria>>({
        url: `/categorias-ejercicio/${id}`,
        method: 'put',
        data: {
            nombre: data.nombre,
            esGlobal: data.esGlobal,
        },
    });
}
