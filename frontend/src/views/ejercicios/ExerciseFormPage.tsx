import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '@/components/ui/Card';
import ExerciseForm from './components/ExerciseForm';
import {
    apiCreateEjercicio,
    apiGetEjercicioDetails,
    apiUpdateEjercicio,
} from '@/services/ExerciseService';
import { getCategoriasEjercicios } from '@/services/CategoriaEjerciciosService';
import toast from '@/components/ui/toast';
import Spinner from '@/components/ui/Spinner';
import Notification from '@/components/ui/Notification';
import {
    HiOutlineCheckCircle,
    HiOutlineExclamationCircle,
} from 'react-icons/hi';

const ExerciseFormPage: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [categorias, setCategorias] = useState<
        { value: string; label: string }[]
    >([]);
    const [initialValues, setInitialValues] = useState({
        nombre: '',
        categoriaEjercicioId: '',
        descripcion: '',
        esGlobal: false,
        video: [],
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
                    }),
                );
                setCategorias(formattedCategorias);

                // Cargar datos del ejercicio si hay un ID
                if (id) {
                    const ejercicioResponse = await apiGetEjercicioDetails(
                        parseInt(id),
                    );
                    setInitialValues({
                        nombre: ejercicioResponse.data.data.nombre,
                        categoriaEjercicioId:
                            ejercicioResponse.data.data.categoriaEjercicioId.toString(),
                        descripcion: ejercicioResponse.data.data.descripcion,
                        esGlobal: ejercicioResponse.data.data.activo,
                        video: [],
                    });
                }
            } catch {
                toast.push(
                    <Notification title="Error" type="danger">
                        Hubo un problema al cargar los datos.
                    </Notification>,
                );
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleSubmit = async (formData: FormData) => {
        try {
            const payload: Record<string, any> = {};
            formData.forEach((value, key) => {
                payload[key] = value;
            });

            if (id) {
                await apiUpdateEjercicio({
                    id: parseInt(id),
                    ...payload,
                });
            } else {
                await apiCreateEjercicio(payload);
            }

            toast.push(
                <Notification
                    title="Éxito"
                    type="success"
                    icon={<HiOutlineCheckCircle />}
                >
                    Ejercicio {id ? 'actualizado' : 'creado'} correctamente.
                </Notification>
            );

            navigate('/ejercicios/listado');
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || 'Ocurrió un problema.';
            toast.push(
                <Notification
                    title="Error"
                    type="danger"
                    icon={<HiOutlineExclamationCircle />}
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
