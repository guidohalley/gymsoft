import React, { useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface ExerciseTableToolsProps {
    onSearch: (searchTerm: string) => void;
}

const ExerciseTableTools: React.FC<ExerciseTableToolsProps> = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        onSearch(e.target.value);
    };

    const handleAddExercise = () => {
        window.location.href = '/ejercicios/nuevo'; // Redirección al formulario de creación
    };

    return (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
            {/* Campo de búsqueda */}
            <Input
                placeholder="Buscar ejercicios..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full sm:w-auto"
            />
            {/* Botón "Nuevo Ejercicio" */}
            <Button variant="solid" onClick={handleAddExercise}>
                Nuevo Ejercicio
            </Button>
        </div>
    );
};

export default ExerciseTableTools;
