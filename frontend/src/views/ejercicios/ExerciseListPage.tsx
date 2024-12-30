import React, { useEffect, useState } from 'react';
import { apiGetEjercicios, apiUpdateEjercicio, apiDeleteEjercicio } from '@/services/ExerciseService';
import ExerciseTable from '@/views/ejercicios/components/ExerciseTable';
 import ExerciseTableTools from '@/views/ejercicios/components/ExerciseTableTools';
import Card from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';
import Notification from '@/components/ui/Notification';
import toast from '@/components/ui/toast';

const ExerciseListPage: React.FC = () => {
    const [exercises, setExercises] = useState<any[]>([]);
    const [filteredExercises, setFilteredExercises] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const response = await apiGetEjercicios();
                setExercises(response.data.data);
                setFilteredExercises(response.data.data); // Inicialmente mostramos todos
                setError(null);
            } catch (error) {
                console.error('Error al cargar ejercicios:', error);
                setError('No se pudieron cargar los ejercicios.');
                toast.push(
                    <Notification title="Error" type="danger">
                        Ocurrió un problema al cargar los ejercicios.
                    </Notification>,
                    { placement: 'top-center' },
                );
            } finally {
                setLoading(false);
            }
        };
        fetchExercises();
    }, []);

    const handleSearch = (searchTerm: string) => {
        const lowercasedTerm = searchTerm.toLowerCase();

        const filtered = exercises.filter((exercise) =>
            Object.keys(exercise).some((key) => {
                const value = exercise[key];
                // Validamos que sea un valor legible como string (así evitamos valores como objetos o arrays)
                if (value && typeof value === 'string') {
                    return value.toLowerCase().includes(lowercasedTerm);
                }
                if (value && typeof value === 'number') {
                    return value.toString().toLowerCase().includes(lowercasedTerm);
                }
                return false;
            }),
        );
        setFilteredExercises(filtered);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este ejercicio?')) {
            try {
                await apiDeleteEjercicio(id);
                setExercises((prev) => prev.filter((exercise) => exercise.id !== id));
                setFilteredExercises((prev) => prev.filter((exercise) => exercise.id !== id));
                toast.push(
                    <Notification title="Ejercicio eliminado" type="success">
                        El ejercicio fue eliminado correctamente.
                    </Notification>,
                    { placement: 'top-center' },
                );
            } catch (error) {
                console.error('Error al eliminar el ejercicio:', error);
                toast.push(
                    <Notification title="Error" type="danger">
                        Ocurrió un problema al eliminar el ejercicio.
                    </Notification>,
                    { placement: 'top-center' },
                );
            }
        }
    };

    const handleEdit = (id: number) => {
        // Redirigir al usuario a la página de edición del ejercicio
        window.location.href = `/ejercicios/editar/${id}`;
    };

    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-bold">Listado de Ejercicios</h1>
                <ExerciseTableTools onSearch={handleSearch} />
            </div>
            {loading ? (
                <Spinner />
            ) : error ? (
                <Notification title="Error al cargar" type="danger">
                    {error}
                </Notification>
            ) : filteredExercises.length === 0 ? (
                <Card className="text-center py-8">
                    <h2 className="text-lg font-bold">No hay ejercicios registrados</h2>
                    <p className="text-gray-500">
                        Puedes agregar nuevos ejercicios desde el botón "Nuevo Ejercicio".
                    </p>
                </Card>
            ) : (
                <ExerciseTable
                    data={filteredExercises}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}
        </Card>
    );
};

export default ExerciseListPage;
