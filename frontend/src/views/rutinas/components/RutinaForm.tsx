// @guidohalley - RutinaForm: Formulario para la creación y edición de rutinas en el sistema

import React, { useEffect, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { FormContainer, FormItem } from '@/components/ui/Form';
import Checkbox from '@/components/ui/Checkbox';
import toast from '@/components/ui/toast';
import Notification from '@/components/ui/Notification';
import { apiCreateRutina, apiUpdateRutina, apiGetRutinaDetails, apiAddBloquesToRutina, apiGetBloquesByRutina, apiRemoveBloquesFromRutina } from '@/services/RutinasService';
import { apiGetEjerciciosByBloque } from '@/services/BloqueEjerciciosService';
import Card from '@/components/ui/Card';
import SelectBloques from './SelectBloques';
import Dialog from '@/components/ui/Dialog';
import ListaEjerciciosBloque from './ListaEjerciciosBloque';
import { useNavigate } from 'react-router-dom';



const validationSchema = Yup.object().shape({
    nombre: Yup.string().required('El nombre es obligatorio'),
    descripcion: Yup.string().required('La descripción es obligatoria'),
    estadoId: Yup.number().oneOf([0, 1], 'Debe ser 0 o 1').required('El estado es obligatorio'),
    bloques: Yup.array().min(1, 'Debes seleccionar al menos un bloque'),
});

const RutinaForm: React.FC<{ rutinaId?: number; onSuccess?: () => void }> = ({ rutinaId, onSuccess }) => {
    const navigate = useNavigate();

    // ✅ Usamos useState para almacenar rutinaIdFinal y evitar errores de referencia
    const [rutinaIdFinal, setRutinaIdFinal] = useState<number | null>(rutinaId || null);

    const [initialValues, setInitialValues] = useState({
        nombre: '',
        descripcion: '',
        estadoId: 1,
        bloques: [],
    });

    const [dialogEjerciciosOpen, setDialogEjerciciosOpen] = useState(false);
    const [bloqueSeleccionado, setBloqueSeleccionado] = useState<number | null>(null);
    const [ejercicios, setEjercicios] = useState<any[]>([]);

    useEffect(() => {
        if (rutinaId) {
            const fetchData = async () => {
                try {
                    const response = await apiGetRutinaDetails(rutinaId);
                    const rutina = response.data.data;
                    const bloquesResponse = await apiGetBloquesByRutina(rutinaId);
                    const bloquesAsignados = bloquesResponse.data.data.map((bloque) => ({
                        bloqueId: bloque.bloque_id,
                        orden: bloque.orden,
                        series: bloque.series || '0',
                        descanso: bloque.descanso || '0',
                    }));

                    setInitialValues({
                        nombre: rutina.nombre || '',
                        descripcion: rutina.descripcion || '',
                        estadoId: rutina.activo || false,
                        bloques: bloquesAsignados,
                    });

                    // ✅ Almacenar rutinaId en el estado
                    setRutinaIdFinal(rutinaId);
                } catch (error) {
                    toast.push(
                        <Notification title="Error" type="danger" duration={3000}>
                            ❌ Error al cargar la rutina.
                        </Notification>
                    );
                }
            };
            fetchData();
        }
    }, [rutinaId]);

    const handleSubmit = async (values) => {
        try {
            let rutinaResponse;

            // 🔹 1. Crear o actualizar la rutina
            if (rutinaIdFinal) {
                await apiUpdateRutina({ id: rutinaIdFinal, ...values });
            } else {
                rutinaResponse = await apiCreateRutina({
                    nombre: values.nombre,
                    descripcion: values.descripcion,
                    estadoId: values.estadoId, 
                });

                setRutinaIdFinal(rutinaResponse.data.data.id); // ✅ Guardar en estado
                console.log(`📡 Rutina creada con ID: ${rutinaResponse.data.data.id}`);
            }

            if (!rutinaIdFinal) {
                console.error("❌ No se pudo obtener el ID de la rutina.");
                toast.push(
                    <Notification title="Error" type="danger" duration={3000}>
                        ❌ No se pudo obtener el ID de la rutina.
                    </Notification>
                );
                return;
            }

            // 🔹 2. Asociar bloques solo si hay una rutina creada
            if (Array.isArray(values.bloques) && values.bloques.length > 0) {
                const bloquesFormateados = values.bloques.map((bloque) => ({
                    id: bloque.bloqueId,
                    orden: bloque.orden,
                    series: bloque.series || "0",
                    descanso: bloque.descanso || "0",
                }));

                console.log(`📡 Asociando bloques a rutina ${rutinaIdFinal}...`, JSON.stringify({ bloques: bloquesFormateados }, null, 2));

                await apiAddBloquesToRutina(rutinaIdFinal, bloquesFormateados);

                setTimeout(() => {
                    toast.push(
                        <Notification title="Éxito" type="success" duration={3000}>
                            ✅ Bloques asociados correctamente a la rutina.
                        </Notification>
                    );
                }, 500);
            }

            // 🔹 3. Confirmación final y redirección
            setTimeout(() => {
                toast.push(
                    <Notification title="Rutina guardada" type="success" duration={3000}>
                        ✅ Rutina guardada con éxito.
                    </Notification>
                );
                navigate('/rutinas/listado');  // ✅ Redirección después de mostrar el mensaje
            }, 1000);

        } catch (error) {
            console.error("❌ Error al guardar rutina:", error);
            toast.push(
                <Notification title="Error" type="danger" duration={3000}>
                    ❌ Error al guardar la rutina.
                </Notification>
            );
        }
    };
    
    return (
        <Card header={rutinaId ? 'Editar Rutina' : 'Crear Rutina'}>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                enableReinitialize
                onSubmit={handleSubmit}
            >
                {({ values, setFieldValue }) => (
                    <Form>
                        <FormContainer>
                            <FormItem label="Nombre" asterisk>
                                <Field name="nombre" component={Input} placeholder="Ingrese el nombre de la rutina" />
                            </FormItem>

                            <FormItem label="Descripción" asterisk>
                                <Field name="descripcion" component={Input} placeholder="Ingrese la descripción de la rutina" />
                            </FormItem>

                            <FormItem>
                                <Checkbox checked={values.estadoId === 1} onChange={(checked) => setFieldValue('estadoId', checked ? 1 : 2)}>
                                    Activo
                                </Checkbox>
                            </FormItem>

                            <FormItem label="Bloques" asterisk>
                                <SelectBloques
                                    rutinaId={rutinaIdFinal} // ✅ Pasamos rutinaIdFinal a SelectBloques
                                    selectedBloques={values.bloques}
                                    onChange={(bloques) => setFieldValue('bloques', bloques)}
                                    onOpenEjercicios={(bloqueId) => {
                                        setBloqueSeleccionado(bloqueId);
                                        setDialogEjerciciosOpen(true);
                                    }}
                                />
                            </FormItem>

                            <Button variant="solid" type="submit">
                                {rutinaId ? 'Actualizar Rutina' : 'Crear Rutina'}
                            </Button>
                        </FormContainer>
                        <Dialog isOpen={dialogEjerciciosOpen} onClose={() => setDialogEjerciciosOpen(false)} width="max-w-md">
                            <h5 className="mb-4 text-lg font-bold">Este bloque tiene estos ejercicios</h5>
                            <ListaEjerciciosBloque ejercicios={ejercicios} />
                            <div className="text-right mt-6">
                                <Button variant="plain" onClick={() => setDialogEjerciciosOpen(false)}>
                                    Cerrar
                                </Button>
                            </div>
                        </Dialog>
                    </Form>
                )}
            </Formik>
        </Card>
    );
};

export default RutinaForm;
