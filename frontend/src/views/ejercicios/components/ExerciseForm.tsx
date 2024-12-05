import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { FormContainer, FormItem } from '@/components/ui/Form';
import Select from '@/components/ui/Select';
import Checkbox from '@/components/ui/Checkbox';
import toast from '@/components/ui/toast';
import Notification from '@/components/ui/Notification';
import ExerciseUpload from './ExerciseUpload';
import { HiOutlineCheckCircle, HiOutlineExclamationCircle } from 'react-icons/hi';

const validationSchema = Yup.object().shape({
    nombre: Yup.string().required('El nombre es requerido'),
    descripcion: Yup.string().required('La descripción es requerida'),
    categoriaEjercicioId: Yup.string().required('Debes seleccionar una categoría'),
    esGlobal: Yup.boolean(),
    archivo: Yup.array()
        .of(Yup.object().shape({}))
        .min(1, 'Debes subir al menos un archivo')
        .max(1, 'Solo se permite un archivo'),
});

interface ExerciseFormProps {
    onSubmit: (values: FormData) => Promise<void>;
    categorias: { value: string; label: string }[];
    initialValues: {
        nombre: string;
        descripcion: string;
        categoriaEjercicioId: string;
        esGlobal: boolean;
        archivo: File[];
    };
}

const ExerciseForm: React.FC<ExerciseFormProps> = ({
    onSubmit,
    categorias,
    initialValues,
}) => {
    const [loading, setLoading] = useState(false);

    return (
        <Formik
            initialValues={{
                ...initialValues,
                archivo: initialValues.archivo || [], // Aseguramos que archivo siempre sea un arreglo
            }}
            validationSchema={validationSchema}
            onSubmit={async (values, { resetForm }) => {
                setLoading(true);
                try {
                    const formData = new FormData();
                    formData.append('nombre', values.nombre);
                    formData.append('descripcion', values.descripcion);
                    formData.append('categoriaEjercicioId', values.categoriaEjercicioId);
                    formData.append('esGlobal', values.esGlobal ? 'true' : 'false');
                    if (values.archivo.length > 0) {
                        formData.append('archivo', values.archivo[0]);
                    }

                    await onSubmit(formData);

                    toast.push(
                        <Notification
                            title="Éxito"
                            customIcon={<HiOutlineCheckCircle className="text-2xl text-green-500" />}
                        >
                            Ejercicio creado exitosamente.
                        </Notification>,
                    );
                    resetForm();
                } catch (error) {
                    toast.push(
                        <Notification
                            title="Error"
                            customIcon={<HiOutlineExclamationCircle className="text-2xl text-red-500" />}
                        >
                            Ocurrió un problema al guardar el ejercicio.
                        </Notification>,
                    );
                } finally {
                    setLoading(false);
                }
            }}
        >
            {({ values, touched, errors, setFieldValue }) => (
                <Form>
                    <FormContainer>
                        <FormItem
                            label="Nombre del ejercicio"
                            asterisk
                            invalid={!!errors.nombre && touched.nombre}
                            errorMessage={errors.nombre}
                        >
                            <Field
                                name="nombre"
                                component={Input}
                                placeholder="Ingrese el nombre del ejercicio"
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
                                as="textarea"
                                className="border rounded w-full h-20 p-2"
                                placeholder="Descripción del ejercicio"
                            />
                        </FormItem>

                        <FormItem
                            label="Categoría"
                            asterisk
                            invalid={!!errors.categoriaEjercicioId && touched.categoriaEjercicioId}
                            errorMessage={errors.categoriaEjercicioId}
                        >
                            <Field name="categoriaEjercicioId">
                                {({ field, form }: any) => (
                                    <Select
                                        value={categorias.find(
                                            (option) => option.value === field.value,
                                        )}
                                        placeholder="Seleccione una categoría..."
                                        options={categorias}
                                        onChange={(option) =>
                                            option && form.setFieldValue(field.name, option.value)
                                        }
                                    />
                                )}
                            </Field>
                        </FormItem>

                        <FormItem
                            label="Es Ejercicio Global"
                            invalid={!!errors.esGlobal && touched.esGlobal}
                            errorMessage={errors.esGlobal as string}
                        >
                            <Field name="esGlobal">
                                {({ field }: any) => (
                                    <Checkbox
                                        checked={field.value}
                                        onChange={(e) => setFieldValue('esGlobal', e.target.checked)}
                                    >
                                        Marcar como ejercicio global
                                    </Checkbox>
                                )}
                            </Field>
                        </FormItem>

                        <FormItem
                            label="Archivo"
                            invalid={!!errors.archivo && touched.archivo}
                            errorMessage={errors.archivo as string}
                        >
                            <ExerciseUpload
                                value={values.archivo.length > 0 ? values.archivo[0] : null}
                                onChange={(file) => setFieldValue('archivo', file ? [file] : [])}
                                maxFileSizeMB={5}
                                renameFile={(originalName) =>
                                    `ejercicio-${values.nombre.replace(/\s+/g, '_')}-${Date.now()}.${
                                        originalName.split('.').pop()
                                    }`
                                }
                            />
                        </FormItem>

                        <FormItem>
                            <Button variant="solid" type="submit" loading={loading}>
                                Guardar
                            </Button>
                            <Button variant="plain" type="reset">
                                Limpiar
                            </Button>
                        </FormItem>
                    </FormContainer>
                </Form>
            )}
        </Formik>
    );
};

export default ExerciseForm;
