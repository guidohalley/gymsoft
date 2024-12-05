import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // React Router
import Card from '@/components/ui/Card';
import ExerciseForm from './components/ExerciseForm';
import { apiCreateEjercicio, apiGetEjercicioDetails } from '@/services/ExerciseService';
import { getCategoriasEjercicios } from '@/services/CategoriaEjerciciosService';
import toast from '@/components/ui/toast';
import Spinner from '@/components/ui/Spinner';
import Notification from '@/components/ui/Notification';
import { HiOutlineCheckCircle, HiOutlineExclamationCircle } from 'react-icons/hi';

const ExerciseFormPage: React.FC = () => {
    const { id } = useParams(); // Obtener ID para edición
    const navigate = useNavigate();
    const [categorias, setCategorias] = useState<{ value: string; label: string }[]>([]);
    const [initialValues, setInitialValues] = useState({
        nombre: '',
        categoriaEjercicioId: '',
        descripcion: '',
        estado: 'Activo',
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoriasResponse = await getCategoriasEjercicios();
                const formattedCategorias = categoriasResponse.data.data.map((categoria) => ({
                    value: categoria.id.toString(),
                    label: categoria.nombre,
                }));
                setCategorias(formattedCategorias);

                if (id) {
                    // Cargar datos para edición
                    const ejercicioResponse = await apiGetEjercicioDetails({ id: parseInt(id) });
                    setInitialValues({
                        nombre: ejercicioResponse.data.nombre,
                        categoriaEjercicioId: ejercicioResponse.data.categoriaEjercicioId.toString(),
                        descripcion: ejercicioResponse.data.descripcion,
                        estado: ejercicioResponse.data.activo ? 'Activo' : 'Inactivo',
                    });
                }
            } catch (error) {
                toast.push(
                    <Notification
                        title="Error"
                        type="danger"
                        icon={<HiOutlineExclamationCircle />}
                    >
                        Hubo un problema al cargar los datos.
                    </Notification>
                );
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleSubmit = async (values: any) => {
        try {
            if (id) {
                // Lógica de edición
                // Implementar `apiUpdateEjercicio`
            } else {
                await apiCreateEjercicio(values);
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
            navigate('/ejercicios');
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Ocurrió un problema.';
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
            <h2 className="text-xl font-bold mb-4">{id ? 'Editar Ejercicio' : 'Nuevo Ejercicio'}</h2>
            <ExerciseForm initialValues={initialValues} categorias={categorias} onSubmit={handleSubmit} />
        </Card>
    );
};

export default ExerciseFormPage;
