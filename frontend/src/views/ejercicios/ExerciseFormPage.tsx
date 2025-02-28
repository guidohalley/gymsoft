import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '@/components/ui/Card';
import ExerciseForm from './components/ExerciseForm';
import { useExercises } from '@/hooks/useExercises';
import { getCategoriasEjercicios } from '@/services/CategoriaEjerciciosService';
import Spinner from '@/components/ui/Spinner';
import toast from '@/components/ui/toast';
import Notification from '@/components/ui/Notification';
import { apiGetEjercicioDetails } from '@/services/ExerciseService';

const ExerciseFormPage: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { createExercise, updateExercise } = useExercises();

    const [categorias, setCategorias] = useState<
        { value: string; label: string }[]
    >([]);
    const [initialValues, setInitialValues] = useState({
        nombre: '',
        descripcion: '',
        categoriaEjercicioId: '',
        activo: true,
        esGlobal: false,
        videoUrl: '',
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
    
                // Cargar categorías
                const categoriasResponse = await getCategoriasEjercicios();
                const formattedCategorias = categoriasResponse.data.data.map(
                    (categoria) => ({
                        value: categoria.id.toString(),
                        label: categoria.nombre,
                    })
                );
                setCategorias(formattedCategorias);
    
                // Cargar datos del ejercicio si hay un ID
                if (id) {
                    const ejercicioResponse = await apiGetEjercicioDetails(parseInt(id));
                    const ejercicio = ejercicioResponse.data.data;
              
                    if (ejercicio) {
                        setInitialValues({
                            nombre: ejercicio.nombre || '',
                            categoriaEjercicioId: ejercicio.categoriaEjercicioId.toString() || '',
                            descripcion: ejercicio.descripcion || '',
                            esGlobal: ejercicio.esGlobal || false,
                            activo: ejercicio.activo || false,
                            videoUrl: ejercicio.url || '',
                        });
                    }
                }
            } catch (error) {
                console.error('Error al cargar los datos:', error);
                toast.push(
                    <Notification title="Error" type="danger">
                        Hubo un problema al cargar los datos.
                    </Notification>
                );
            } finally {
                setLoading(false);
            }
        };
    
        fetchData();
    }, [id]);

    const handleSubmit = async (formData: FormData) => {
        try {
            const payload = new FormData();

            // Agrega todos los campos al FormData
            formData.forEach((value, key) => {
                payload.append(key, value);
            });

            // Si no se selecciona un archivo nuevo, conservar la URL actual
            if (!formData.get("video") && initialValues.videoUrl) {
                payload.append("videoUrl", initialValues.videoUrl);
            }

            let response;
            if (id) {
                response = await updateExercise(parseInt(id), payload);
            } else {
                response = await createExercise(payload);
            }

            // Actualizar valores iniciales con la nueva URL si la API devuelve una
            if (response.data?.url) {
                setInitialValues((prev) => ({ ...prev, videoUrl: response.data.url }));
            }

            toast.push(
                <Notification
                    title="Éxito"
                    type="success"
                >
                    Ejercicio {id ? 'actualizado' : 'creado'} correctamente.
                </Notification>
            );

            navigate('/ejercicios/listado');
        } catch (error) {
            console.error('Error al guardar el ejercicio:', error);
            const errorMessage =
                error.response?.data?.message || 'Ocurrió un problema.';
            toast.push(
                <Notification
                    title="Error"
                    type="danger"
                >
                    {errorMessage}
                </Notification>
            );
        }
    };

    if (loading) {
        return <Spinner />;
    }
    return (
        <Card>
            <h2 className="text-xl font-bold mb-4">
                {id ? 'Editar Ejercicio' : 'Nuevo Ejercicio'}
            </h2>



            <ExerciseForm
                initialValues={initialValues}
                categorias={categorias}
                onSubmit={handleSubmit}
                enableReinitialize
            />
        </Card>
    );
};

export default ExerciseFormPage;
