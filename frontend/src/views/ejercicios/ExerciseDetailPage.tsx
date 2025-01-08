import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { apiGetEjercicioDetails } from '@/services/ExerciseService';
import ExerciseShare from '@/views/ejercicios/components/ExerciseSearch';
import Card from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';
import Notification from '@/components/ui/Notification';
import toast from '@/components/ui/toast';

const ExerciseDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const history = useHistory();
    const [exercise, setExercise] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchExercise = async () => {
            try {
                setLoading(true);
                const data = await apiGetEjercicioDetails({ id: Number(id) });
                setExercise(data);
            } catch (error) {
                toast.push(
                    <Notification title="Error al cargar ejercicio" type="danger">
                        No se pudo cargar el ejercicio solicitado.
                    </Notification>,
                    { placement: 'top-center' }
                );
            } finally {
                setLoading(false);
            }
        };
        fetchExercise();
    }, [id]);

    if (loading) {
        return <Spinner />;
    }

    if (!exercise) {
        return <div>No se encontró el ejercicio.</div>;
    }

    return (
        <Card>
            <h1 className="text-lg font-bold mb-4">Detalles del Ejercicio</h1>
            <p><strong>Nombre:</strong> {exercise.nombre}</p>
            <p><strong>Categoría:</strong> {exercise.categoria}</p>
            <p><strong>Descripción:</strong> {exercise.descripcion}</p>
            <ExerciseShare exerciseId={exercise.id} exerciseName={exercise.nombre} />
            <Button variant="outline" onClick={() => history.push('/ejercicios/listado')}>Volver</Button>
        </Card>
    );
};

export default ExerciseDetailPage;
