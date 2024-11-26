import ApiService from './ApiService'
import type {
    ApiMusculosResponse,
    NuevoMusculo,
    ApiMusculosByIdResponse,
    MusculoFiltro,
    Musculo,
} from '@/@types/custom/musculos'

export async function apiGetMusculos(filtro: MusculoFiltro) {
    return ApiService.fetchData<ApiMusculosResponse>({
        url: '/musculos',
        method: 'get',
        params: filtro,
    })
}

export async function apiGetMusculoById(id: number) {
    return ApiService.fetchData<ApiMusculosByIdResponse>({
        url: `/musculos/${id}`,
        method: 'get',
    })
}

export async function apiCreateMusculo(data: NuevoMusculo) {
    return ApiService.fetchData<ApiMusculosResponse>({
        url: '/musculos',
        method: 'post',
        data,
    })
}

export async function apiEditarMusculo(id: number, data: NuevoMusculo) {
    return ApiService.fetchData<ApiMusculosResponse>({
        url: `/musculos/${id}`,
        method: 'put',
        data,
    })
}

export async function apiDeleteMusculo(id: number) {
    return ApiService.fetchData<ApiMusculosResponse>({
        url: `/musculos/${id}`,
        method: 'delete',
    })
}
