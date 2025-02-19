import React from 'react';
import { useClaseForm } from '@/hooks/useClaseForm';
import { FormikProvider, Form } from 'formik';
import { useParams, useNavigate } from 'react-router-dom';

import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { FormContainer, FormItem } from '@/components/ui/Form';
import SelectRutinas from '@/views/clases/components/SelectRutinas'; // 🔹 Para elegir la rutina a asignar
import Notification from '@/components/ui/Notification';
import Spinner from '@/components/ui/Spinner';

const ClaseForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const claseId = id ? Number(id) : undefined;

  const { formik, loading, fetching, error } = useClaseForm(claseId, () => {
    navigate('/clases/listado');
  });

  if (fetching) return <Spinner />;
  if (error) {
    return (
      <Notification title="Error" type="danger">
        {error}
      </Notification>
    );
  }

  return (
    <Card>
      <h2 className="text-xl font-bold mb-4">
        {claseId ? 'Editar Clase' : 'Crear Clase'}
      </h2>
      <FormikProvider value={formik}>
        <Form onSubmit={formik.handleSubmit}>
          <FormContainer>
            <FormItem label="Descripción" asterisk>
              <Input
                name="descripcion"
                value={formik.values.descripcion}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Ingrese una descripción"
              />
              {formik.touched.descripcion && formik.errors.descripcion && (
                <div className="text-red-500 text-sm">{formik.errors.descripcion}</div>
              )}
            </FormItem>

            <FormItem label="Fecha Inicio" asterisk>
              <Input
                type="date"
                name="fechaInicio"
                value={formik.values.fechaInicio}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.fechaInicio && formik.errors.fechaInicio && (
                <div className="text-red-500 text-sm">{formik.errors.fechaInicio}</div>
              )}
            </FormItem>

            <FormItem label="Fecha Fin" asterisk>
              <Input
                type="date"
                name="fechaFin"
                value={formik.values.fechaFin}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.fechaFin && formik.errors.fechaFin && (
                <div className="text-red-500 text-sm">{formik.errors.fechaFin}</div>
              )}
            </FormItem>

            <FormItem label="Tipo de Clase" asterisk>
              <Input
                type="number"
                name="tipoClaseId"
                value={formik.values.tipoClaseId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.tipoClaseId && formik.errors.tipoClaseId && (
                <div className="text-red-500 text-sm">{formik.errors.tipoClaseId}</div>
              )}
            </FormItem>

            <FormItem label="Rutina" asterisk>
              <SelectRutinas
                value={formik.values.rutinaId}
                onChange={(rutinaId) => formik.setFieldValue('rutinaId', rutinaId)}
              />
              {formik.touched.rutinaId && formik.errors.rutinaId && (
                <div className="text-red-500 text-sm">{formik.errors.rutinaId}</div>
              )}
            </FormItem>

            <Button variant="solid" type="submit" disabled={loading}>
              {claseId ? 'Actualizar' : 'Crear'} Clase
            </Button>
          </FormContainer>
        </Form>
      </FormikProvider>
    </Card>
  );
};

export default ClaseForm;