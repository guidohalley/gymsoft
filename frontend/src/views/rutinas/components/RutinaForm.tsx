import React, { useEffect, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { FormContainer, FormItem } from '@/components/ui/Form';
import Checkbox from '@/components/ui/Checkbox';
import toast from '@/components/ui/toast';
import Notification from '@/components/ui/Notification';
import { apiCreateRutina, apiUpdateRutina, apiGetRutinaDetails, apiAddBloquesToRutina, apiGetBloquesByRutina } from '@/services/RutinasService';
import { apiGetEjerciciosByBloque } from '@/services/BloqueEjerciciosService';
import Card from '@/components/ui/Card';
import SelectBloques from './SelectBloques';
import Dialog from '@/components/ui/Dialog';
import ListaEjerciciosBloque from './ListaEjerciciosBloque';

const validationSchema = Yup.object().shape({
    nombre: Yup.string().required('El nombre es obligatorio'),
    descripcion: Yup.string().required('La descripción es obligatoria'),
    activo: Yup.boolean(),
    bloques: Yup.array().min(1, 'Debes seleccionar al menos un bloque'),
});

const RutinaForm: React.FC<{ rutinaId?: number; onSuccess?: () => void }> = ({ rutinaId, onSuccess }) => {
    const [initialValues, setInitialValues] = useState({
        nombre: '',
        descripcion: '',
        activo: false,
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
                        repeticiones: bloque.repeticiones,
                        series: bloque.series,
                        descanso: bloque.descanso,
                        peso: bloque.peso,
                    }));

                    setInitialValues({
                        nombre: rutina.nombre || '',
                        descripcion: rutina.descripcion || '',
                        activo: rutina.activo || false,
                        bloques: bloquesAsignados,
                    });
                } catch (error) {
                    console.error('❌ Error al cargar la rutina:', error);
                }
            };

            fetchData();
        }
    }, [rutinaId]);

    useEffect(() => {
        const fetchEjercicios = async () => {
            if (bloqueSeleccionado !== null) {
                try {
                    const response = await apiGetEjerciciosByBloque(bloqueSeleccionado);
                    const ejerciciosLimpios = response.data.data.map((item) => ({
                        id: item.ejercicio.id,
                        nombre: item.ejercicio.nombre,
                        url: item.ejercicio.url,
                        series: item.series,
                        repeticiones: item.repeticiones,
                        descanso: item.descanso,
                        peso: item.peso,
                    }));

                    setEjercicios(ejerciciosLimpios);
                } catch (error) {
                    console.error('❌ Error al cargar los ejercicios:', error);
                }
            }
        };

        if (dialogEjerciciosOpen) {
            fetchEjercicios();
        }
    }, [bloqueSeleccionado, dialogEjerciciosOpen]);

    const handleSubmit = async (values) => {
        const payload = {
            id: rutinaId,
            nombre: values.nombre,
            descripcion: values.descripcion,
            activo: values.activo,
            bloques: values.bloques.map((bloque) => ({
                id: bloque.bloqueId,
                orden: bloque.orden,
                repeticiones: bloque.repeticiones,
                series: bloque.series,
                descanso: bloque.descanso,
                peso: bloque.peso,
            })),
        };
    
        console.log("🚀 Enviando datos para actualizar rutina:", JSON.stringify(payload, null, 2));
    
        try {
            await apiUpdateRutina(payload);
            
            // 🔹 Primero eliminamos los bloques que fueron removidos
            const bloquesActuales = initialValues.bloques.map(b => b.bloqueId);
            const bloquesNuevos = values.bloques.map(b => b.bloqueId);
            const bloquesEliminados = bloquesActuales.filter(id => !bloquesNuevos.includes(id));
    
            if (bloquesEliminados.length > 0) {
                console.log("🗑 Eliminando bloques:", bloquesEliminados);
                await apiRemoveBloquesFromRutina(rutinaId, bloquesEliminados);
            }
    
            // 🔹 Luego agregamos los nuevos bloques
            await apiAddBloquesToRutina(rutinaId, values.bloques);
            
            toast.push("✅ Rutina actualizada con éxito", { type: "success" });
        } catch (error) {
            console.error("❌ Error al actualizar la rutina:", error);
            toast.push("❌ Error al actualizar la rutina", { type: "danger" });
        }
    };
    

    return (
        <Card header={rutinaId ? 'Editar Rutina' : 'Crear Rutina'}>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                enableReinitialize
                onSubmit={async (values) => {
                    try {
                        if (rutinaId) {
                            await apiUpdateRutina({ id: rutinaId, ...values });
                            await apiAddBloquesToRutina(rutinaId, values.bloques);
                        } else {
                            const response = await apiCreateRutina(values);
                            await apiAddBloquesToRutina(response.data.id, values.bloques);
                        }

                        toast.push(<Notification title="Rutina guardada" type="success">Guardado exitoso.</Notification>);
                        if (onSuccess) onSuccess();
                    } catch (error) {
                        console.error('❌ Error al guardar rutina:', error);
                        toast.push(<Notification title="Error" type="danger">No se pudo guardar.</Notification>);
                    }
                }}
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
                                <Checkbox checked={values.activo} onChange={(checked) => setFieldValue('activo', checked)}>
                                    Activo
                                </Checkbox>
                            </FormItem>

                            <FormItem label="Bloques" asterisk>
                                <SelectBloques
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
                            <h5 className="mb-4 text-lg font-bold">Ejercicios del Bloque</h5>
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
