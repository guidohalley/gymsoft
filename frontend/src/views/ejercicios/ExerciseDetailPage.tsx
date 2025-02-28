// src/views/ejercicios/ExerciseDetailPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useExercises } from '@/hooks/useExercises';
import Card from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';
import Notification from '@/components/ui/Notification';
import toast from '@/components/ui/toast';
import Button from '@/components/ui/Button';

const ExerciseDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { exercises, fetchExercises, loading, error } = useExercises();
    const [exercise, setExercise] = useState<any>(null);

    useEffect(() => {
        if (exercises.length === 0) {
            fetchExercises();
        } else {
            const foundExercise = exercises.find(
                (ex) => ex.id === parseInt(id || '')
            );
            if (foundExercise) {
                setExercise(foundExercise);
            } else {
                toast.push(
                    <Notification title="Error" type="danger">
                        No se pudo encontrar el ejercicio solicitado.
                    </Notification>
                );
            }
        }
    }, [id, exercises, fetchExercises]);

    if (loading) {
        return <Spinner />;
    }

    if (error) {
        return (
            <Notification title="Error al cargar" type="danger">
                {error}
            </Notification>
        );
    }

    if (!exercise) {
        return (
            <Card>
                <h1 className="text-lg font-bold mb-4">Detalles del Ejercicio</h1>
                <p>No se encontró el ejercicio solicitado.</p>
                <Button variant="outline" onClick={() => navigate('/ejercicios/listado')}>
                    Volver
                </Button>
            </Card>
        );
    }

    return (
        <Card>
            <h1 className="text-lg font-bold mb-4">Detalles del Ejercicio</h1>
            <p>
                <strong>Nombre:</strong> {exercise.nombre}
            </p>
            <p>
                <strong>Categoría:</strong> {exercise.categoriaEjercicioId}
            </p>
            <p>
                <strong>Descripción:</strong> {exercise.descripcion}
            </p>
            <p>
                <strong>Activo:</strong> {exercise.activo ? 'Sí' : 'No'}
            </p>
            {exercise.url && (
                <div className="mt-4">
                    <strong>Video:</strong>
                    <video controls src={exercise.url} className="w-64 h-36 rounded-md mt-2" />
                </div>
            )}
            <Button variant="outline" onClick={() => navigate('/ejercicios/listado')} className="mt-4">
                Volver
            </Button>
        </Card>
    );
};

export default ExerciseDetailPage;
