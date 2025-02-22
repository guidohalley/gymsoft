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
import CreatableSelect from 'react-select/creatable';
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

  const { tiposClases, loading: loadingTiposClases } = useTipoClase();

  useEffect(() => {
    if (!claseId && !formik.values.fechaInicio && !formik.values.fechaFin) {
      formik.setFieldValue('fechaInicio', dayjs().toDate());
      formik.setFieldValue('fechaFin', dayjs().add(1, 'day').toDate());
    }
  }, [claseId, formik.values.fechaInicio, formik.values.fechaFin, formik]);

  if (fetching) return <Spinner />;
  if (error) {
    return (
      <Notification title="Error" type="danger">
        {error}
      </Notification>
    );
  }

  const disablePastDates = (date: Date) => {
    return dayjs(date).isBefore(dayjs(), 'day');
  };

  return (
    <Card header="Gestión de Clases">
      <FormikProvider value={formik}>
        <Form onSubmit={formik.handleSubmit}>
          <FormContainer>
            <div className="grid grid-cols-1 gap-4">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {/* Card Fecha Inicio */}
                <Card header="Fecha Inicio" className="p-2 shadow-sm w-fit mx-auto">
                  <FormItem
                    asterisk
                    invalid={formik.touched.fechaInicio && !!formik.errors.fechaInicio}
                    errorMessage={formik.errors.fechaInicio}
                    className="p-0 m-0"
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

                {/* Card Fecha Fin */}
                <Card header="Fecha Fin" className="p-2 shadow-sm w-fit mx-auto">
                  <FormItem
                    asterisk
                    invalid={formik.touched.fechaFin && !!formik.errors.fechaFin}
                    errorMessage={formik.errors.fechaFin}
                    className="p-0 m-0"
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
              

              <FormItem
                asterisk
                label="Tipo de Clase"
                invalid={formik.touched.tipoClaseId && !!formik.errors.tipoClaseId}
                errorMessage={formik.errors.tipoClaseId}
              >
                <CreatableSelect
                  isClearable
                  placeholder="Seleccione o cree un tipo de clase"
                  onChange={(newValue) => {
                    const valueUpper = newValue ? newValue.value.toUpperCase() : '';
                    formik.setFieldValue('tipoClaseId', valueUpper);
                  }}
                  options={tiposClases.map(tc => ({ value: tc.descripcion, label: tc.descripcion }))}
                  isLoading={loadingTiposClases}
                />
              </FormItem>

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
