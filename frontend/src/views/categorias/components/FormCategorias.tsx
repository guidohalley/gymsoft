// src/views/categorias/components/FormCategorias.tsx
import { useState } from 'react';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import { FormItem, FormContainer } from '@/components/ui/Form';
import { addCategoriaEjercicio } from '@/services/CategoriaEjerciciosService';
import toast from '@/components/ui/toast';
import Notification from '@/components/ui/Notification';
import { HiOutlineCheckCircle, HiOutlineExclamationCircle } from 'react-icons/hi';

const validationSchema = Yup.object().shape({
    nombre: Yup.string()
        .min(3, '¡Nombre muy corto!')
        .required('Nombre requerido'),
    esGlobal: Yup.boolean(),
});

interface FormCategoriasProps {
    onAddCategoria: () => void;
}

const FormCategorias: React.FC<FormCategoriasProps> = ({ onAddCategoria }) => {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values: { nombre: string; esGlobal: boolean }, { resetForm }: any) => {
        setLoading(true);
        try {
            await addCategoriaEjercicio(values);

            // Mostrar notificación de éxito
            toast.push(
                <Notification
                    title="Categoría agregada"
                    customIcon={<HiOutlineCheckCircle className="text-2xl text-green-500" />}
                >
                    La categoría se ha agregado exitosamente.
                </Notification>
            );

            onAddCategoria(); // Recargar la lista de categorías
            resetForm();
        } catch (error) {
            console.error('Error al agregar la categoría:', error);

            // Mostrar notificación de error
            toast.push(
                <Notification
                    title="Error"
                    customIcon={<HiOutlineExclamationCircle className="text-2xl text-red-500" />}
                >
                    Hubo un error al agregar la categoría.
                </Notification>
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Formik
                initialValues={{
                    nombre: '',
                    esGlobal: false,
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ touched, errors, resetForm }) => (
                    <Form>
                        <FormContainer>
                            <FormItem
                                label="Nombre"
                                invalid={!!errors.nombre && touched.nombre}
                                errorMessage={errors.nombre}
                            >
                                <Field
                                    type="text"
                                    autoComplete="off"
                                    name="nombre"
                                    placeholder="Nombre"
                                    component={Input}
                                />
                            </FormItem>
                            <FormItem label="Es Global">
                                <Field name="esGlobal" component={Checkbox}>
                                    Es Global
                                </Field>
                            </FormItem>
                            <FormItem>
                                <Button
                                    type="reset"
                                    className="ltr:mr-2 rtl:ml-2"
                                    onClick={() => resetForm()}
                                    disabled={loading}
                                >
                                    Reset
                                </Button>
                                <Button variant="solid" type="submit" loading={loading}>
                                    Submit
                                </Button>
                            </FormItem>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default FormCategorias;
