import { useState, useEffect } from 'react';
import { TipoClase } from '@/types/TipoClase';
import { apiGetTiposClases, apiCreateTipoClase, apiUpdateTipoClase, apiDeleteTipoClase } from '@/services/TipoClaseService';

export const useTipoClase = () => {
  const [tiposClases, setTiposClases] = useState<TipoClase[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTiposClases = async () => {
    setLoading(true);
    try {
      const response = await apiGetTiposClases();
      console.log('Response from apiGetTiposClases:', response);
      setTiposClases(response.data.data);
    } catch (err) {
      console.error('Error fetching tiposClases:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTiposClases();
  }, []);

  const createTipoClase = async (tipoClase: TipoClase) => {
    setLoading(true);
    try {
      const response = await apiCreateTipoClase(tipoClase);
      console.log('Response from apiCreateTipoClase:', response);
      const newTipoClase = response.data.data;
      setTiposClases([...tiposClases, newTipoClase]);
      return newTipoClase;
    } catch (err) {
      console.error('Error creating tipoClase:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const updateTipoClase = async (id: number, tipoClase: TipoClase) => {
    setLoading(true);
    try {
      const response = await apiUpdateTipoClase(id, tipoClase);
      console.log('Response from apiUpdateTipoClase:', response);
      const updatedTipoClase = response.data.data;
      setTiposClases(tiposClases.map(tc => (tc.id === id ? updatedTipoClase : tc)));
      return updatedTipoClase;
    } catch (err) {
      console.error('Error updating tipoClase:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTipoClase = async (id: number) => {
    setLoading(true);
    try {
      await apiDeleteTipoClase(id);
      setTiposClases(tiposClases.filter(tc => tc.id !== id));
    } catch (err) {
      console.error('Error deleting tipoClase:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { tiposClases, loading, error, createTipoClase, updateTipoClase, deleteTipoClase, fetchTiposClases };
};
