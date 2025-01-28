import React, { useEffect, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { FormContainer, FormItem } from '@/components/ui/Form';
import Checkbox from '@/components/ui/Checkbox';
import toast from '@/components/ui/toast';
import Notification from '@/components/ui/Notification';
import { addBloque, updateBloque, getBloqueById, Bloque } from '@/services/BloquesService';
import { apiCreateBloqueEjercicios } from '@/services/BloqueEjerciciosService';
import SelectEjercicios from './SelectEjercicios';
import { HiOutlineCheckCircle, HiOutlineExclamationCircle } from 'react-icons/hi';
import { Card } from '@/components/ui';

// Validación del formulario con Yup
const validationSchema = Yup.object().shape({
    descripcion: Yup.string().required('La descripción es obligatoria'),
    activo: Yup.boolean().required(),
    ejercicios: Yup.array()
        .of(
            Yup.object().shape({
                ejercicioId: Yup.number().required(),
                repeticiones: Yup.string().required('Las repeticiones son obligatorias'),
                series: Yup.number().min(1, 'Las series deben ser mayores a 0').required(),
                descanso: Yup.number().min(0, 'El descanso no puede ser negativo').required(),
                peso: Yup.number().min(0, 'El peso no puede ser negativo').optional(),
            }),
        )
        .min(1, 'Debes seleccionar al menos un ejercicio'),
});

interface BloqueFormProps {
    bloqueId?: number; // ID del bloque para editar (opcional)
    onSuccess?: () => void; // Callback después de guardar
}

const BloquesForm: React.FC<BloqueFormProps> = ({ bloqueId, onSuccess }) => {
    const [initialValues, setInitialValues] = useState<Partial<Bloque>>({
        descripcion: '',
        activo: false,
        ejercicios: [],
    });
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(!!bloqueId); // Mostrar spinner al cargar datos

    useEffect(() => {
        if (bloqueId) {
            const fetchData = async () => {
                try {
                    const response = await getBloqueById(bloqueId);
                    const bloque = response.data.data;
    
                    console.log('Datos del bloque obtenidos desde la API:', bloque); // ✅ Verifica los datos del bloque
    
                    setInitialValues({
                        descripcion: bloque.descripcion || '',
                        activo: bloque.activo || false,
                        ejercicios: bloque.ejercicios?.map((ej: any) => ({
                            ejercicioId: ej.ejercicioId,
                            repeticiones: ej.repeticiones || '',
                            series: ej.series || 1,
                            descanso: ej.descanso || 0,
                            peso: ej.peso || 0,
                        })) || [],
                    });
    
                    console.log('Valores iniciales después de setInitialValues:', {
                        descripcion: bloque.descripcion || '',
                        activo: bloque.activo || false,
                        ejercicios: bloque.ejercicios?.map((ej: any) => ({
                            ejercicioId: ej.ejercicioId,
                            repeticiones: ej.repeticiones || '',
                            series: ej.series || 1,
                            descanso: ej.descanso || 0,
                            peso: ej.peso || 0,
                        })) || [],
                    }); // ✅ Verifica los valores iniciales
                } catch (error) {
                    console.error('Error al cargar los datos del bloque:', error);
                } finally {
                    setLoadingData(false);
                }
            };
            fetchData();
        }
    }, [bloqueId]);

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
                        console.log('Valores enviados al guardar:', values);
                        setLoading(true);
                        try {
                            let bloqueResponse;
                            if (bloqueId) {
                                bloqueResponse = await updateBloque(bloqueId, values);
                                toast.push(
                                    <Notification
                                        title="Actualización exitosa"
                                        type="success"
                                        customIcon={<HiOutlineCheckCircle className="text-2xl text-green-500" />}
                                    >
                                        El bloque ha sido actualizado correctamente.
                                    </Notification>,
                                );
                            } else {
                                bloqueResponse = await addBloque(values);
                                toast.push(
                                    <Notification
                                        title="Creación exitosa"
                                        type="success"
                                        customIcon={<HiOutlineCheckCircle className="text-2xl text-green-500" />}
                                    >
                                        Se ha creado un nuevo bloque.
                                    </Notification>,
                                );
                            }

                            const ejerciciosFormateados = values.ejercicios.map((ej) => ({
                                ejercicioId: ej.ejercicioId,
                                orden: ej.orden || 1,
                                repeticiones: ej.repeticiones || '',
                                series: ej.series || 1,
                                descanso: ej.descanso || 30,
                                peso: ej.peso || 4,
                            }));

                            if (bloqueResponse?.data?.data?.id) {
                                await apiCreateBloqueEjercicios(
                                    bloqueResponse.data.data.id,
                                    ejerciciosFormateados,
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
                                    {String(error)}
                                </Notification>,
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

                                <FormItem>
                                    <Checkbox
                                        checked={values.activo}
                                        onChange={(checked) => setFieldValue('activo', checked)}
                                    >
                                        Activo
                                    </Checkbox>
                                </FormItem>

                                <FormItem
                                    label="Ejercicios"
                                    asterisk
                                    invalid={!!errors.ejercicios && touched.ejercicios}
                                    errorMessage={errors.ejercicios as string}
                                >
                                    <SelectEjercicios
                                        bloqueId={bloqueId} // ✅ Se pasa como prop
                                        selectedEjercicios={values.ejercicios || []}
                                        onChange={(selectedEjercicios) =>
                                            setFieldValue('ejercicios', selectedEjercicios)
                                        }
                                    />
                                </FormItem>

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
            )}
        </Card>
    );
};

export default BloquesForm;
