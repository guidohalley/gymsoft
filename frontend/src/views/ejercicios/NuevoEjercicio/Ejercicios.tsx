import { useState } from 'react';
import NuevoEjercicio from '@/components/ejercicios/NuevoEjercicio';
import ListadoEjercicio from '@/components/ejercicios/ListadoEjercicio';

const Ejercicios = () => {
    // Estado para almacenar los ejercicios registrados
    const [exercises, setExercises] = useState([]);

    // Función para agregar un nuevo ejercicio a la lista
    const handleAddExercise = (newExercise) => {
        setExercises((prevExercises) => [...prevExercises, newExercise]);
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Registro de Ejercicios</h1>
            
            {/* Componente para agregar nuevo ejercicio */}
            <NuevoEjercicio onAddExercise={handleAddExercise} />

            <div className="mt-10">
                <h2 className="text-2xl font-semibold mb-4">Ejercicios Registrados</h2>
                
                {/* Componente para listar los ejercicios registrados */}
                <ListadoEjercicio exercises={exercises} />
            </div>
        </div>
    );
};

export default Ejercicios;
