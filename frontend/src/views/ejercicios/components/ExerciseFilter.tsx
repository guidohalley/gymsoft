import React, { useEffect, useState } from 'react';
import { apiGetEjercicios } from '@/services/ExerciseService';
import ExerciseTable from '@/views/ejercicios/components/ExerciseTable';
import Card from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';
import Notification from '@/components/ui/Notification';
import Input from '@/components/ui/Input';
import toast from '@/components/ui/toast';

const ExerciseListPage: React.FC = () => {
    const [exercises, setExercises] = useState<any[]>([]);
    const [filteredExercises, setFilteredExercises] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>(''); // Campo de búsqueda

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                setLoading(true);
                const response = await apiGetEjercicios();
                const exercisesData = response.data.data;

                setExercises(exercisesData);
                setFilteredExercises(exercisesData);
                setError(null);
            } catch (error) {
                console.error('Error al cargar ejercicios:', error);
                setError('No se pudieron cargar los ejercicios.');
                toast.push(
                    <Notification title="Error" type="danger">
                        Ocurrió un problema al cargar los ejercicios.
                    </Notification>,
                    { placement: 'top-center' }
                );
            } finally {
                setLoading(false);
            }
        };

        fetchExercises();
    }, []);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchValue = e.target.value.toLowerCase();
        setSearchTerm(searchValue);

        const filtered = exercises.filter((exercise) =>
            exercise.nombre.toLowerCase().includes(searchValue)
        );

        setFilteredExercises(filtered);
    };

    return (
        <Card className="w-full max-w-full overflow-x-auto">
            <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
                <h1 className="text-xl font-bold">Listado de Ejercicios</h1>
                <Input
                    type="text"
                    placeholder="Buscar por nombre"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full sm:w-auto"
                />
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
                    <p className="text-gray-500">Prueba ajustando tu búsqueda o agrega nuevos ejercicios.</p>
                </Card>
            ) : (
                <div className="overflow-x-auto">
                    <ExerciseTable
                        data={filteredExercises}
                        onEdit={(id) => console.log('Edit ID:', id)}
                        onDelete={(id) => console.log('Delete ID:', id)}
                    />
                </div>
            )}
        </Card>
    );
};

export default ExerciseListPage;
