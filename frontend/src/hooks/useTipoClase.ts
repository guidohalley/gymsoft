import { useState, useEffect } from 'react';
import { TipoClase } from '@/types/TipoClase';
import { apiGetTiposClases, apiCreateTipoClase, apiUpdateTipoClase, apiDeleteTipoClase } from '@/services/TipoClaseService';

export const useTipoClase = () => {
  const [tiposClases, setTiposClases] = useState<TipoClase[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    apiGetTiposClases()
      .then(setTiposClases)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const createTipoClase = async (tipoClase: TipoClase) => {
    setLoading(true);
    try {
      const newTipoClase = await apiCreateTipoClase(tipoClase);
      setTiposClases([...tiposClases, newTipoClase]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateTipoClase = async (id: number, tipoClase: TipoClase) => {
    setLoading(true);
    try {
      const updatedTipoClase = await apiUpdateTipoClase(id, tipoClase);
      setTiposClases(tiposClases.map(tc => (tc.id === id ? updatedTipoClase : tc)));
    } catch (err) {
      setError(err.message);
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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { tiposClases, loading, error, createTipoClase, updateTipoClase, deleteTipoClase };
};
