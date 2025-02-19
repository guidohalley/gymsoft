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
          console.log('Clase fetched:', res.data.data); // Debugging
          // Ajusta según la respuesta real del backend
          setInitialValues({
            ...res.data.data,
            fechaInicio: dayjs(res.data.data.fechaInicio).toDate(),
            fechaFin: dayjs(res.data.data.fechaFin).toDate(),
          });
        } catch (err) {
          console.error('Error fetching clase:', err); // Debugging
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

        console.log('Submitting values:', formattedValues); // Debugging

        if (claseId) {
          // Editar
          await apiUpdateClase(claseId, formattedValues);
          console.log('Clase updated:', formattedValues); // Debugging
        } else {
          // Crear
          await apiCreateClase(formattedValues);
          console.log('Clase created:', formattedValues); // Debugging
        }
        if (onSuccess) onSuccess();
      } catch (err) {
        console.error('Error saving clase:', err); // Debugging
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