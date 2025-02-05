import React from 'react';
import Button from '@/components/ui/Button';

interface ExerciseItemProps {
    exercise: any;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
}

const ExerciseItem: React.FC<ExerciseItemProps> = ({ exercise, onEdit, onDelete }) => {
    console.log(exercise);
    return (
        <tr>
            <td>{exercise.nombre}</td>
            <td>{exercise.categoria}</td>
            <td>{exercise.estado}</td>
            <td>
                <div className="flex gap-2">
                    <Button size="sm" variant="plain" onClick={() => onEdit(exercise.id)}>
                        Editar
                    </Button>
                    <Button size="sm" variant="solid" onClick={() => onDelete(exercise.id)}>
                        Eliminar
                    </Button>
                </div>
            </td>
        </tr>
    );
};

export default ExerciseItem;
