import ApiService from './ApiService'
import {ApiDevicesReponse,Device,NewDevice,ApiDeviceReponse} from '@/@types/custom/devices'

/* export async function apiGetDevices(filtro: MusculoFiltro) {
    return ApiService.fetchData<ApiDevicesReponse>({
        url: '/dispositivos',
        method: 'get',
        params: filtro,
    })
} */

export async function apiGetDeviceById(id: number) {
    return ApiService.fetchData<ApiDeviceReponse>({
        url: `/dispositivos/${id}`,
        method: 'get',
    })
}

export async function apiCreateDevice(data: NewDevice) {
    return ApiService.fetchData<ApiDevicesReponse>({
        url: '/dispositivos',
        method: 'post',
        data,
    })
}

export async function apiEditDevice(id: number, data: NewDevice) {
    return ApiService.fetchData<ApiDevicesReponse>({
        url: `/dispositivos/${id}`,
        method: 'put',
        data,
    })
}

export async function apiDeleteDevice(id: number) {
    return ApiService.fetchData<ApiDevicesReponse>({
        url: `/dispositivos/${id}`,
        method: 'delete',
    })
}
