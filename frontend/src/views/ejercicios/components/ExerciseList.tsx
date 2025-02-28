import React from 'react';
import ExerciseItem from './ExerciseItem';

interface ExerciseListProps {
    exercises: any[];
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
}

const ExerciseList: React.FC<ExerciseListProps> = ({ exercises, onEdit, onDelete }) => {
    return (
        <table className="table-auto w-full border-collapse border border-gray-200">
            <thead>
                <tr>
                    <th className="border border-gray-200 px-4 py-2">Nombre</th>
                    <th className="border border-gray-200 px-4 py-2">Categoría</th>
                    <th className="border border-gray-200 px-4 py-2">Estado</th>
                    <th className="border border-gray-200 px-4 py-2">Acciones</th>
                </tr>
            </thead>
            <tbody>
                {exercises.map((exercise) => (
                    <ExerciseItem
                        key={exercise.id}
                        exercise={exercise}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                ))}
            </tbody>
        </table>
    );
};

export default ExerciseList;
