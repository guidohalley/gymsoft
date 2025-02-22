import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTipoClase } from '@/hooks/useTipoClase';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { FormContainer, FormItem } from '@/components/ui/Form';
import Input from '@/components/ui/Input';
import Notification from '@/components/ui/Notification';
import Spinner from '@/components/ui/Spinner';
import Checkbox from '@/components/ui/Checkbox';

const validationSchema = Yup.object().shape({
  descripcion: Yup.string().required('La descripción es obligatoria'),
  esGlobal: Yup.boolean().required('Es Global es obligatorio'),
});

const TipoClaseFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const tipoClaseId = id ? Number(id) : undefined;

  const { tiposClases, createTipoClase, updateTipoClase, loading, error } = useTipoClase();

  const tipoClase = Array.isArray(tiposClases) ? tiposClases.find(tc => tc.id === tipoClaseId) : undefined;

  const formik = useFormik({
    initialValues: {
      descripcion: tipoClase ? tipoClase.descripcion : '',
      esGlobal: tipoClase ? tipoClase.esGlobal : false,
    },
    validationSchema,
    onSubmit: async (values) => {
      if (tipoClaseId) {
        await updateTipoClase(tipoClaseId, values);
      } else {
        await createTipoClase(values);
      }
      navigate('/clases/tipo');
    },
  });

  useEffect(() => {
    if (!tipoClaseId && formik.values.esGlobal !== false) {
      formik.setFieldValue('esGlobal', false);
    }
  }, [tipoClaseId, formik]);

  if (loading) return <Spinner />;
  if (error) {
    return (
      <Notification title="Error" type="danger">
        {error}
      </Notification>
    );
  }

  return (
    <Card header={tipoClaseId ? 'Editar Tipo de Clase' : 'Nuevo Tipo de Clase'}>
      <form onSubmit={formik.handleSubmit}>
        <FormContainer>
          <FormItem
            asterisk
            label="Descripción"
            invalid={formik.touched.descripcion && !!formik.errors.descripcion}
            errorMessage={formik.errors.descripcion}
          >
            <Input
              type="text"
              name="descripcion"
              value={formik.values.descripcion}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Ingrese una descripción"
              className="w-full"
            />
          </FormItem>
          <FormItem>
            <Checkbox
              checked={formik.values.esGlobal}
              onChange={(checked: boolean) =>
                formik.setFieldValue('esGlobal', checked)
              }
            >
              Es Global
            </Checkbox>
          </FormItem>
          <div className="flex justify-end mt-4">
            <Button variant="solid" type="submit" disabled={loading}>
              {tipoClaseId ? 'Actualizar' : 'Crear'} Tipo de Clase
            </Button>
          </div>
        </FormContainer>
      </form>
    </Card>
  );
};

export default TipoClaseFormPage;
