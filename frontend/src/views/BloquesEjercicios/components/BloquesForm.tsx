// frontend/src/views/BloquesEjercicios/components/BloquesForm.tsx
import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { FormContainer, FormItem } from '@/components/ui/Form';
import Checkbox from '@/components/ui/Checkbox';
import toast from '@/components/ui/toast';
import Notification from '@/components/ui/Notification';
import { addBloque, updateBloque, Bloque } from '@/services/BloquesService';
import SelectEjercicios from './SelectEjercicios'; // ✅ Importar el selector de ejercicios
import { HiOutlineCheckCircle, HiOutlineExclamationCircle } from 'react-icons/hi';
import { Card } from '@/components/ui';

// ✅ Validación del formulario con Yup
const validationSchema = Yup.object().shape({
    descripcion: Yup.string().required('La descripción es obligatoria'),
    orden: Yup.number().required('El orden es obligatorio').min(1, 'El orden debe ser mayor a 0'),
    series: Yup.string().optional(),
    descanso: Yup.string().optional(),
    activo: Yup.boolean().required(),
    ejercicios: Yup.array().of(Yup.number()).required('Debes seleccionar al menos un ejercicio'),
});

interface BloqueFormProps {
    initialValues: Partial<Bloque>;
    bloqueId?: number;
    onSuccess?: () => void;
}

const BloquesForm: React.FC<BloqueFormProps> = ({
    initialValues = {
        descripcion: '',
        orden: 1,
        series: '',
        descanso: '',
        activo: false,
        ejercicios: [],
    },
    bloqueId,
    onSuccess,
}) => {
    const [loading, setLoading] = useState(false);

    return (
        <Card>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                enableReinitialize
                onSubmit={async (values) => {
                    setLoading(true);
                    try {
                        if (bloqueId) {
                            // ✅ Actualizar bloque existente
                            await updateBloque(bloqueId, values);
                            toast.push(
                                <Notification
                                    title="Actualización exitosa"
                                    type="success"
                                    customIcon={<HiOutlineCheckCircle className="text-2xl text-green-500" />}
                                >
                                    El bloque ha sido actualizado correctamente.
                                </Notification>
                            );
                        } else {
                            // ✅ Crear nuevo bloque
                            await addBloque(values);
                            toast.push(
                                <Notification
                                    title="Creación exitosa"
                                    type="success"
                                    customIcon={<HiOutlineCheckCircle className="text-2xl text-green-500" />}
                                >
                                    Se ha creado un nuevo bloque.
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
                                Ocurrió un problema al guardar el bloque.
                            </Notification>
                        );
                        console.error('Error al guardar el bloque:', error);
                    } finally {
                        setLoading(false);
                    }
                }}
            >
                {({ values, errors, touched, setFieldValue }) => (
                    <Form>
                        <FormContainer>
                            {/* Descripción */}
                            <FormItem
                                label="Descripción"
                                asterisk
                                invalid={!!errors.descripcion && touched.descripcion}
                                errorMessage={errors.descripcion}
                            >
                                <Field
                                    name="descripcion"
                                    component={Input}
                                    placeholder="Ingrese la descripción del bloque"
                                />
                            </FormItem>

                            {/* Orden */}
                            <FormItem
                                label="Orden"
                                asterisk
                                invalid={!!errors.orden && touched.orden}
                                errorMessage={errors.orden}
                            >
                                <Field
                                    name="orden"
                                    component={Input}
                                    type="number"
                                    placeholder="Ingrese el orden del bloque"
                                />
                            </FormItem>

                            {/* Series */}
                            <FormItem label="Series">
                                <Field
                                    name="series"
                                    component={Input}
                                    placeholder="Ingrese el número de series"
                                />
                            </FormItem>

                            {/* Descanso */}
                            <FormItem label="Descanso">
                                <Field
                                    name="descanso"
                                    component={Input}
                                    placeholder="Ingrese el tiempo de descanso"
                                />
                            </FormItem>

                            {/* Activo */}
                            <FormItem>
                                <Checkbox
                                    checked={values.activo}
                                    onChange={(checked) => setFieldValue('activo', checked)}
                                >
                                    Activo
                                </Checkbox>
                            </FormItem>

                            {/* Selector de ejercicios */}
                            <FormItem
                                label="Ejercicios"
                                asterisk
                                invalid={!!errors.ejercicios && touched.ejercicios}
                                errorMessage={errors.ejercicios as string}
                            >
                                <SelectEjercicios
                                    selectedEjercicios={values.ejercicios || []}
                                    onChange={(selectedEjercicios) =>
                                        setFieldValue('ejercicios', selectedEjercicios)
                                    }
                                />
                            </FormItem>

                            {/* Botones de acción */}
                            <FormItem>
                                <Button variant="solid" type="submit" loading={loading}>
                                    {bloqueId ? 'Actualizar Bloque' : 'Crear Bloque'}
                                </Button>
                                <Button variant="plain" type="reset">
                                    Limpiar
                                </Button>
                            </FormItem>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </Card>
    );
};

export default BloquesForm;
