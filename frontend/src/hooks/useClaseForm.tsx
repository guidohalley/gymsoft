import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { apiGetClaseById, apiCreateClase, apiUpdateClase } from '@/services/ClasesService';
import { IClase } from '@/types/clases';
import dayjs from 'dayjs';

export const useClaseForm = (
  claseId?: number,
  onSuccess?: () => void
) => {
  const [initialValues, setInitialValues] = useState<IClase>({
    descripcion: '',
    fechaInicio: '',
    fechaFin: '',
    tipoClaseId: 0,
    rutinaId: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(!!claseId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (claseId) {
      // Cargar datos de la clase y setear en initialValues
      const fetchClase = async () => {
        setFetching(true);
        try {
          const res = await apiGetClaseById(claseId);
          // Ajusta según la respuesta real del backend
          setInitialValues({
            ...res.data.data,
            fechaInicio: dayjs(res.data.data.fechaInicio).toDate(),
            fechaFin: dayjs(res.data.data.fechaFin).toDate(),
          });
        } catch (err) {
          setError('No se pudieron cargar los datos de la clase');
        } finally {
          setFetching(false);
        }
      };
      fetchClase();
    }
  }, [claseId]);

  const validationSchema = Yup.object().shape({
    descripcion: Yup.string().required('La descripción es obligatoria'),
    fechaInicio: Yup.string().required('La fecha de inicio es obligatoria'),
    fechaFin: Yup.string().required('La fecha de fin es obligatoria'),
    tipoClaseId: Yup.number().required('El tipo de clase es obligatorio'),
    rutinaId: Yup.number().required('La rutina es obligatoria'),
  });

  const formik = useFormik<IClase>({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        // Formatear las fechas antes de enviar
        const formattedValues = {
          ...values,
          fechaInicio: dayjs(values.fechaInicio).format('YYYY-MM-DD'),
          fechaFin: dayjs(values.fechaFin).format('YYYY-MM-DD'),
        };

        if (claseId) {
          // Editar
          await apiUpdateClase(claseId, formattedValues);
        } else {
          // Crear
          await apiCreateClase(formattedValues);
        }
        if (onSuccess) onSuccess();
      } catch (err) {
        setError('No se pudo guardar la clase');
      } finally {
        setLoading(false);
      }
    },
  });

  return {
    formik,
    loading,
    fetching,
    error,
  };
};