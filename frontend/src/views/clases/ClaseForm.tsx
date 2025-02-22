import React, { useEffect } from 'react';
import { useClaseForm } from '@/hooks/useClaseForm';
import { FormikProvider, Form, Field } from 'formik';
import { useParams, useNavigate } from 'react-router-dom';

import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { FormContainer, FormItem } from '@/components/ui/Form';
import Input from '@/components/ui/Input';
import Calendar from '@/components/ui/Calendar';
import Notification from '@/components/ui/Notification';
import Spinner from '@/components/ui/Spinner';
import SelectRutinas from '@/views/clases/components/SelectRutinas';
import * as Yup from 'yup';
import dayjs from 'dayjs';

// Importamos el componente creatable para Tipo de Clase
import CreatableSelect from '@/views/tiposDeClases/components/CreatableSelect';
import { useTipoClase } from '@/hooks/useTipoClase';

const validationSchema = Yup.object().shape({
  descripcion: Yup.string().required('La descripción es obligatoria'),
  fechaInicio: Yup.date().required('La fecha de inicio es obligatoria').nullable(),
  fechaFin: Yup.date().required('La fecha de fin es obligatoria').nullable(),
  tipoClaseId: Yup.number().required('El tipo de clase es obligatorio'),
  rutinaId: Yup.number().required('La rutina es obligatoria'),
});

const ClaseForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const claseId = id ? Number(id) : undefined;

  const { formik, loading, fetching, error } = useClaseForm(claseId, () => {
    navigate('/clases/listado');
  });

  const { 
    tiposClases, 
    loading: loadingTiposClases,
    createTipoClase, // Función para crear un nuevo Tipo de Clase
    fetchTiposClases // Función para recargar los tipos de clase
  } = useTipoClase();

  useEffect(() => {
    if (!claseId && !formik.values.fechaInicio && !formik.values.fechaFin) {
      formik.setFieldValue('fechaInicio', dayjs().toDate());
      formik.setFieldValue('fechaFin', dayjs().add(1, 'day').toDate());
    }
  }, [claseId, formik.values.fechaInicio, formik.values.fechaFin]);

  if (fetching) return <Spinner />;
  if (error) {
    return (
      <Notification title="Error" type="danger">
        {error}
      </Notification>
    );
  }

  const disablePastDates = (date: Date) => dayjs(date).isBefore(dayjs(), 'day');

  // Función que se dispara al crear una nueva opción en el select
  const handleCreateOption = async (inputValue: string) => {
    try {
      // Se crea el nuevo Tipo de Clase en la API con la lógica definida (por ejemplo, esGlobal true)
      const nuevoTipo = await createTipoClase({
        descripcion: inputValue,
        esGlobal: true,
      });
      // Se recargan los tipos de clase
      await fetchTiposClases();
      // Se actualiza el campo en el formulario para que contenga el nuevo id
      formik.setFieldValue('tipoClaseId', nuevoTipo.id);
    } catch (error) {
      console.error('Error al crear el tipo de clase:', error);
      // Aquí podrías agregar una notificación de error para el usuario
    }
  };

  return (
    <Card header="Gestión de Clases">
      <FormikProvider value={formik}>
        <Form onSubmit={formik.handleSubmit}>
          <FormContainer>
            <div className="grid grid-cols-1 gap-4">
              {/* Campo Descripción */}
              <FormItem
                asterisk
                label="Descripción"
                invalid={formik.touched.descripcion && !!formik.errors.descripcion}
                errorMessage={formik.errors.descripcion}
              >
                <Field
                  type="text"
                  name="descripcion"
                  placeholder="Ingrese una descripción"
                  component={Input}
                  className="w-full"
                />
              </FormItem>

              {/* Fechas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Card header="Fecha Inicio" className="p-2 shadow-sm w-fit mx-auto">
                  <FormItem
                    asterisk
                    invalid={formik.touched.fechaInicio && !!formik.errors.fechaInicio}
                    errorMessage={formik.errors.fechaInicio}
                  >
                    <div className="scale-90">
                      <Calendar
                        value={formik.values.fechaInicio ? new Date(formik.values.fechaInicio) : null}
                        onChange={(date) => formik.setFieldValue('fechaInicio', date)}
                        disableDate={disablePastDates}
                      />
                    </div>
                  </FormItem>
                </Card>
                <Card header="Fecha Fin" className="p-2 shadow-sm w-fit mx-auto">
                  <FormItem
                    asterisk
                    invalid={formik.touched.fechaFin && !!formik.errors.fechaFin}
                    errorMessage={formik.errors.fechaFin}
                  >
                    <div className="scale-90">
                      <Calendar
                        value={formik.values.fechaFin ? new Date(formik.values.fechaFin) : null}
                        onChange={(date) => formik.setFieldValue('fechaFin', date)}
                        disableDate={disablePastDates}
                      />
                    </div>
                  </FormItem>
                </Card>
              </div>

              {/* Campo Tipo de Clase con CreatableSelect */}
              <FormItem
                asterisk
                label="Tipo de Clase"
                invalid={formik.touched.tipoClaseId && !!formik.errors.tipoClaseId}
                errorMessage={formik.errors.tipoClaseId}
              >
                {Array.isArray(tiposClases) ? (
                  <CreatableSelect
                    isClearable
                    placeholder="Seleccione o cree un tipo de clase"
                    onChange={(option) => {
                      // Si se selecciona un tipo existente, asigna su id
                      formik.setFieldValue('tipoClaseId', option ? Number(option.value) : '');
                    }}
                    options={tiposClases.map(tc => ({
                      value: tc.id,
                      label: tc.descripcion,
                    }))}
                    isLoading={loadingTiposClases}
                    onCreateOption={handleCreateOption}
                  />
                ) : (
                  <Notification title="Error" type="danger">
                    tiposClases no es un array válido.
                  </Notification>
                )}
              </FormItem>

              {/* Campo Rutina */}
              <FormItem
                asterisk
                label="Rutina"
                invalid={formik.touched.rutinaId && !!formik.errors.rutinaId}
                errorMessage={formik.errors.rutinaId}
              >
                <SelectRutinas
                  value={formik.values.rutinaId}
                  onChange={(rutinaId) => formik.setFieldValue('rutinaId', rutinaId)}
                  className="w-full"
                />
              </FormItem>
            </div>

            {/* Botón para enviar el formulario */}
            <div className="flex justify-end mt-4">
              <Button variant="solid" type="submit" disabled={loading}>
                {claseId ? 'Actualizar' : 'Crear'} Clase
              </Button>
            </div>
          </FormContainer>
        </Form>
      </FormikProvider>
    </Card>
  );
};

export default ClaseForm;
