import React, { useState, useEffect } from 'react';
import { useExercises } from '@/hooks/useExercises';
import ExerciseTable from '@/views/ejercicios/components/ExerciseTable';
import ExerciseTableTools from '@/views/ejercicios/components/ExerciseTableTools';
import Card from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';
import Notification from '@/components/ui/Notification';

const ExerciseListPage: React.FC = () => {
    const { exercises, loading, error, fetchExercises, deleteExercise } = useExercises();
    const [filteredExercises, setFilteredExercises] = useState<any[]>([]);

    useEffect(() => {
        fetchExercises();
    }, []);
    

    useEffect(() => {
        if (exercises.length > 0) {
            setFilteredExercises(exercises);
            
        }
    }, [exercises]);

    const handleSearch = (searchTerm: string) => {
        const lowercasedTerm = searchTerm.toLowerCase();
        const filtered = exercises.filter((exercise) =>
            Object.keys(exercise).some((key) => {
                const value = exercise[key];
                if (value && typeof value === 'string') {
                    return value.toLowerCase().includes(lowercasedTerm);
                }
                if (value && typeof value === 'number') {
                    return value.toString().toLowerCase().includes(lowercasedTerm);
                }
                return false;
            })
        );
        setFilteredExercises(filtered);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este ejercicio?')) {
            await deleteExercise(id);
        }
    };

    const handleEdit = (id: number) => {
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
                <ExerciseTable data={filteredExercises} onEdit={handleEdit} onDelete={handleDelete} />
            )}
        </Card>
    );
};

export default ExerciseListPage;
