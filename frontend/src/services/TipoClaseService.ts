import ApiService from './ApiService';
import { TipoClase } from '@/types/TipoClase';

const API_URL = '/tipos-clases';

export const apiGetTiposClases = async (): Promise<TipoClase[]> => {
  return ApiService.fetchData<TipoClase[], void>({
    url: API_URL,
    method: 'get',
  });
};

export const apiCreateTipoClase = async (tipoClase: TipoClase): Promise<TipoClase> => {
  return ApiService.fetchData<TipoClase, Partial<TipoClase>>({
    url: API_URL,
    method: 'post',
    data: {
      descripcion: tipoClase.descripcion.toUpperCase(),
      esGlobal: tipoClase.esGlobal,
    },
  });
};

export const apiUpdateTipoClase = async (id: number, tipoClase: TipoClase): Promise<TipoClase> => {
  return ApiService.fetchData<TipoClase, Partial<TipoClase>>({
    url: `${API_URL}/${id}`,
    method: 'put',
    data: {
      activo: true,
      esGlobal: tipoClase.esGlobal,
      descripcion: tipoClase.descripcion.toUpperCase(),
    },
  });
};

export const apiDeleteTipoClase = async (id: number): Promise<void> => {
  return ApiService.fetchData<void, void>({
    url: `${API_URL}/${id}`,
    method: 'delete',
  });
};

export default {
  apiGetTiposClases,
  apiCreateTipoClase,
  apiUpdateTipoClase,
  apiDeleteTipoClase,
};
