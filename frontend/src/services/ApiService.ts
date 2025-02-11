import BaseService from './BaseService';
import type { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

const ApiService = {
    fetchData<Response = unknown, Request = Record<string, unknown>>(
        param: AxiosRequestConfig<Request>
    ) {
        return new Promise<AxiosResponse<Response>>((resolve, reject) => {
            BaseService(param)
                .then((response: AxiosResponse<Response>) => {
                    resolve(response);
                })
                .catch((errors: AxiosError) => {
                    // Manejo centralizado de errores
                    const errorMessage =
                        errors.response?.data?.message || 'Error inesperado';
                    console.error('Error en la solicitud:', errorMessage);
                    reject(new Error(errorMessage));
                });
        });
    },
};

export default ApiService;
