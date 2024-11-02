import { useState } from 'react';
import { Form, Field, Formik } from 'formik';
import * as Yup from 'yup';
import { FormContainer, FormItem } from '@/components/ui/Form';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Checkbox from '@/components/ui/Checkbox';
import Button from '@/components/ui/Button';
import Upload from '@/components/ui/Upload';
import axios from 'axios';

// Validación de formulario usando Yup
const validationSchema = Yup.object().shape({
    nombre: Yup.string().required('Nombre de ejercicio requerido'),
    descripcion: Yup.string().required('Descripción requerida'),
    categoriaEjercicioId: Yup.string().required('Categoría requerida'),
    esGlobal: Yup.boolean(),
});

const initialValues = {
    nombre: '',
    descripcion: '',
    categoriaEjercicioId: '',
    esGlobal: false,
    video: null,
};

const NuevoEjercicio = () => {
    const [exercises, setExercises] = useState([]);

    const onSubmit = async (values, { resetForm }) => {
        const formData = new FormData();
        formData.append('nombre', values.nombre);
        formData.append('descripcion', values.descripcion);
        formData.append('categoriaEjercicioId', values.categoriaEjercicioId);
        formData.append('esGlobal', values.esGlobal);
        if (values.video) {
            formData.append('video', values.video);
        }

        try {
            const response = await axios.post('/api/ejercicios', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setExercises([...exercises, { ...values, id: response.data.id }]);
            resetForm();
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
        }
    };

    // Función para validar el tamaño y tipo de archivo
    const beforeUpload = (files) => {
        const file = files[0];
        const isVideo = file.type.startsWith('video/');
        const isBelowLimit = file.size / 1024 / 1024 <= 4; // Límite de 4 MB

        if (!isVideo) {
            alert('Solo puedes subir archivos de video.');
            return false;
        }

        if (!isBelowLimit) {
            alert('El tamaño del archivo debe ser menor a 4 MB.');
            return false;
        }

        return true;
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Registro de Ejercicios</h2>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                {({ errors, touched, setFieldValue }) => (
                    <Form>
                        <FormContainer>
                            <FormItem
                                label="Nombre de Ejercicio"
                                invalid={errors.nombre && touched.nombre}
                                errorMessage={errors.nombre}
                            >
                                <Field
                                    name="nombre"
                                    placeholder="Nombre del ejercicio"
                                    component={Input}
                                />
                            </FormItem>

                            <FormItem
                                label="Descripción"
                                invalid={errors.descripcion && touched.descripcion}
                                errorMessage={errors.descripcion}
                            >
                                <Field
                                    name="descripcion"
                                    placeholder="Descripción del ejercicio"
                                    component={Input}
                                />
                            </FormItem>

                            <FormItem
                                label="Categoría"
                                invalid={errors.categoriaEjercicioId && touched.categoriaEjercicioId}
                                errorMessage={errors.categoriaEjercicioId}
                            >
                                <Field
                                    name="categoriaEjercicioId"
                                    as={Select}
                                    placeholder="Seleccione una categoría"
                                >
                                    <Select.Option value="1">Cardiovascular</Select.Option>
                                    <Select.Option value="2">Fuerza</Select.Option>
                                    <Select.Option value="3">Flexibilidad</Select.Option>
                                    <Select.Option value="4">Resistencia</Select.Option>
                                </Field>
                            </FormItem>

                            <FormItem label="Es Global">
                                <Field
                                    name="esGlobal"
                                    type="checkbox"
                                    component={Checkbox}
                                >
                                    Es un ejercicio global
                                </Field>
                            </FormItem>

                            <FormItem label="Subir Video">
                                <Upload
                                    beforeUpload={(files) => {
                                        if (beforeUpload(files)) {
                                            const file = files[0];
                                            setFieldValue('video', file);
                                        }
                                        return false; // Evita que el archivo se suba automáticamente
                                    }}
                                >
                                    <Button>Elegir Archivo</Button>
                                </Upload>
                            </FormItem>

                            <Button variant="solid" color="blue" type="submit">
                                Agregar
                            </Button>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default NuevoEjercicio;
