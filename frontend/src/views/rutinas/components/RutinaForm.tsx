import React, { useEffect, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { FormContainer, FormItem } from '@/components/ui/Form';
import Checkbox from '@/components/ui/Checkbox';
import toast from '@/components/ui/toast';
import Notification from '@/components/ui/Notification';
import { apiCreateRutina, apiUpdateRutina, apiGetRutinaDetails } from '@/services/RutinasService';
import { HiOutlineCheckCircle, HiOutlineExclamationCircle } from 'react-icons/hi';
import { Card } from '@/components/ui';

// Esquema de validación con Yup
const validationSchema = Yup.object().shape({
    nombre: Yup.string().required('El nombre es obligatorio'),
    descripcion: Yup.string().required('La descripción es obligatoria'),
    activo: Yup.boolean().required(),
});

interface RutinaFormProps {
    rutinaId?: number; // ID de la rutina para editar (opcional)
    onSuccess?: () => void; // Callback después de guardar
}

const RutinaForm: React.FC<RutinaFormProps> = ({ rutinaId, onSuccess }) => {
    const [initialValues, setInitialValues] = useState({
        nombre: '',
        descripcion: '',
        activo: false,
    });
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(!!rutinaId);

    useEffect(() => {
        if (rutinaId) {
            const fetchData = async () => {
                try {
                    const response = await apiGetRutinaDetails(rutinaId);
                    const rutina = response.data.data;

                    setInitialValues({
                        nombre: rutina.nombre || '',
                        descripcion: rutina.descripcion || '',
                        activo: rutina.activo || false,
                    });
                } catch (error) {
                    console.error('Error al cargar la rutina:', error);
                } finally {
                    setLoadingData(false);
                }
            };
            fetchData();
        }
    }, [rutinaId]);

    return (
        <Card>
            {loadingData ? (
                <div className="text-center py-8">
                    <span className="text-gray-500">Cargando datos...</span>
                </div>
            ) : (
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    enableReinitialize
                    onSubmit={async (values) => {
                        setLoading(true);
                        try {
                            if (rutinaId) {
                                await apiUpdateRutina(rutinaId, values);
                                toast.push(
                                    <Notification
                                        title="Rutina actualizada"
                                        type="success"
                                        customIcon={<HiOutlineCheckCircle className="text-2xl text-green-500" />}
                                    >
                                        La rutina ha sido actualizada correctamente.
                                    </Notification>
                                );
                            } else {
                                await apiCreateRutina(values);
                                toast.push(
                                    <Notification
                                        title="Rutina creada"
                                        type="success"
                                        customIcon={<HiOutlineCheckCircle className="text-2xl text-green-500" />}
                                    >
                                        Se ha creado una nueva rutina.
                                    </Notification>
                                );
                            }

                            if (onSuccess) onSuccess();
                        } catch (error) {
                            toast.push(
                                <Notification
                                    title="Error"
                                    type="danger"
                                    customIcon={<HiOutlineExclamationCircle className="text-2xl text-red-500" />}
                                >
                                    No se pudo guardar la rutina.
                                </Notification>
                            );
                        } finally {
                            setLoading(false);
                        }
                    }}
                >
                    {({ values, errors, touched, setFieldValue }) => (
                        <Form>
                            <FormContainer>
                                <FormItem
                                    label="Nombre"
                                    asterisk
                                    invalid={!!errors.nombre && touched.nombre}
                                    errorMessage={errors.nombre}
                                >
                                    <Field
                                        name="nombre"
                                        component={Input}
                                        placeholder="Ingrese el nombre de la rutina"
                                    />
                                </FormItem>

                                <FormItem
                                    label="Descripción"
                                    asterisk
                                    invalid={!!errors.descripcion && touched.descripcion}
                                    errorMessage={errors.descripcion}
                                >
                                    <Field
                                        name="descripcion"
                                        component={Input}
                                        placeholder="Ingrese la descripción de la rutina"
                                    />
                                </FormItem>

                                <FormItem>
                                    <Checkbox
                                        checked={values.activo}
                                        onChange={(checked) => setFieldValue('activo', checked)}
                                    >
                                        Activo
                                    </Checkbox>
                                </FormItem>

                                <FormItem>
                                    <Button variant="solid" type="submit" loading={loading}>
                                        {rutinaId ? 'Actualizar Rutina' : 'Crear Rutina'}
                                    </Button>
                                    <Button variant="plain" type="reset">
                                        Limpiar
                                    </Button>
                                </FormItem>
                            </FormContainer>
                        </Form>
                    )}
                </Formik>
            )}
        </Card>
    );
};

export default RutinaForm;
