import React from 'react'
import Card from '@/components/ui/Card'
import Tag from '@/components/ui/Tag'

interface Ejercicio {
    id: number;
    nombre: string;
    url: string;
    series: number;
    repeticiones: string;
    descanso: number;
    peso: number;
}

interface ListaEjerciciosBloqueProps {
    ejercicios: Ejercicio[];
}

const ListaEjerciciosBloque: React.FC<ListaEjerciciosBloqueProps> = ({ ejercicios }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ejercicios.length > 0 ? (
                ejercicios.map((ejercicio) => (
                    <Card
                        key={ejercicio.id}
                        clickable
                        className="hover:shadow-lg transition duration-150 ease-in-out dark:border dark:border-blue-600 dark:border-solid"
                        header={
                            <div className="flex justify-center">
                                <div className="rounded-lg overflow-hidden max-w-xs mx-auto mt-2 shadow-lg">
                                    <video controls className="w-full h-40 object-cover">
                                        <source src={ejercicio.url} type="video/mp4" />
                                        Tu navegador no soporta la reproducción de videos.
                                    </video>
                                </div>
                            </div>

                        }
                        headerClass="p-0"
                        footerBorder={false}
                        headerBorder={false}
                    >
                        {/* 🔹 Nombre del ejercicio */}
                        <h4 className="text-base font-bold my-1 text-center">{ejercicio.nombre}</h4>

                        {/* 🔹 Etiquetas en dos columnas */}
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            <Tag className="bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-100 border-0 rounded">
                                {ejercicio.series} Series
                            </Tag>
                            <Tag className="bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-100 border-0 rounded">
                                {ejercicio.repeticiones} Reps
                            </Tag>
                            <Tag className="bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-100 border-0 rounded">
                                {ejercicio.descanso} seg descanso
                            </Tag>
                            <Tag className="bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-100 border-0 rounded">
                                {ejercicio.peso} kg
                            </Tag>
                        </div>
                    </Card>
                ))
            ) : (
                <p className="text-gray-500 text-center col-span-3">No hay ejercicios asignados a este bloque.</p>
            )}
        </div>
    );
};

export default ListaEjerciciosBloque;
