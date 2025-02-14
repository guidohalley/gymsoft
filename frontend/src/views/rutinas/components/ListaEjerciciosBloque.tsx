import React from "react";
import { useExercises } from "@/hooks/useExercises";
import Card from "@/components/ui/Card";
import Tag from "@/components/ui/Tag";

const ListaEjerciciosBloque: React.FC<{ bloqueId: number | null }> = ({ bloqueId }) => {
    const { exercises } = useExercises();

    // 🔹 Filtrar solo los ejercicios del bloque seleccionado
    const ejerciciosBloque = exercises.filter((ej) => ej.bloqueId === bloqueId);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            {ejerciciosBloque.length > 0 ? (
                ejerciciosBloque.map((ejercicio) => (
                    <Card key={ejercicio.id} className="hover:shadow-lg transition duration-150 ease-in-out">
                        <video controls className="w-full h-40 object-cover">
                            <source src={ejercicio.url} type="video/mp4" />
                            Tu navegador no soporta la reproducción de videos.
                        </video>
                        <h4 className="text-base font-bold my-1 text-center">{ejercicio.nombre}</h4>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            <Tag>{ejercicio.series} Series</Tag>
                            <Tag>{ejercicio.repeticiones} Reps</Tag>
                            <Tag>{ejercicio.descanso} seg descanso</Tag>
                            <Tag>{ejercicio.peso} kg</Tag>
                        </div>
                    </Card>
                ))
            ) : (
                <p className="text-gray-500 text-center col-span-3">No hay ejercicios en este bloque.</p>
            )}
        </div>
    );
};

export default ListaEjerciciosBloque;
