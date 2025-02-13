import React, { useEffect, useState } from 'react';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import Input from '@/components/ui/Input';
import { getBloques } from '@/services/BloquesService'; // 📌 Ahora obtenemos los bloques desde la API
import Spinner from '@/components/ui/Spinner';

const { Tr, Th, Td, THead, TBody } = Table;

interface Bloque {
    id: number;
    descripcion: string;
}

interface RutinaBloque {
    bloqueId: number;
    orden: number;
}

interface SelectBloquesProps {
    selectedBloques: RutinaBloque[];
    onChange: (selectedBloques: RutinaBloque[]) => void;
    onOpenEjercicios: (bloqueId: number) => void;
}

const SelectBloques: React.FC<SelectBloquesProps> = ({ selectedBloques, onChange, onOpenEjercicios }) => {
    const [bloquesDisponibles, setBloquesDisponibles] = useState<Bloque[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBloques = async () => {
            try {
                const response = await getBloques();
                setBloquesDisponibles(response.data.data);
            } catch (error) {
                console.error('❌ Error al cargar los bloques:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBloques();
    }, []);

    const handleSelectBloque = async (bloque: Bloque, isSelected: boolean) => {
        let updatedBloques = [...selectedBloques];
    
        if (isSelected) {
            if (!updatedBloques.some((b) => b.bloqueId === bloque.id)) {
                updatedBloques.push({ bloqueId: bloque.id, orden: updatedBloques.length + 1, series: "", descanso: "" });
            }
        } else {
            updatedBloques = updatedBloques.filter((b) => b.bloqueId !== bloque.id);
        }
    
        // 🔹 Actualizar el estado local
        onChange(updatedBloques);
    
        // 🔹 Llamar a la API si hay una rutina creada
        if (rutinaId) {
            try {
                console.log(`📡 Asociando bloques a la rutina ${rutinaId}...`);
                await apiAddBloquesToRutina(rutinaId, updatedBloques);
                toast.push(
                    <Notification title="Éxito" type="success">
                        ✅ Bloques actualizados en la rutina
                    </Notification>
                );
            } catch (error) {
                console.error("❌ Error al asociar bloques:", error);
                toast.push(
                    <Notification title="Error" type="danger">
                        ❌ No se pudo asociar el bloque a la rutina
                    </Notification>
                );
            }
        }
    };
    

    return (
        <div className="bg-white p-4 rounded shadow mt-4">
            <h3 className="text-lg font-bold mb-4">Seleccionar Bloques</h3>
            {loading ? (
                <div className="flex justify-center items-center py-4">
                    <Spinner size="lg" /> <span className="ml-2">Cargando bloques...</span>
                </div>
            ) : (
                <Table>
                    <THead>
                        <Tr>
                            <Th>Seleccionar</Th>
                            <Th>Descripción</Th>
                            <Th>Orden</Th>
                            <Th>Ejercicios</Th>
                        </Tr>
                    </THead>
                    <TBody>
                        {bloquesDisponibles.length > 0 ? (
                            bloquesDisponibles.map((bloque) => {
                                const isSelected = selectedBloques.some((b) => b.bloqueId === bloque.id);
                                return (
                                    <Tr key={bloque.id}>
                                        <Td>
                                            <Checkbox
                                                checked={isSelected}
                                                onChange={(checked) => handleSelectBloque(bloque, checked)}
                                            />
                                        </Td>
                                        <Td>{bloque.descripcion}</Td>
                                        <Td>
                                            {isSelected && (
                                                <Input
                                                    type="number"
                                                    value={selectedBloques.find((b) => b.bloqueId === bloque.id)?.orden || 1}
                                                    onChange={(e) => handleOrdenChange(bloque.id, Number(e.target.value))}
                                                />
                                            )}
                                        </Td>
                                        <Td>
                                        <Button
                                            size="xs"
                                            variant="twoTone"
                                            color="blue-600"
                                            onClick={(e) => {
                                                e.preventDefault(); // 🔹 Evita que Formik tome esto como un envío de formulario
                                                e.stopPropagation(); // 🔹 Evita la propagación del evento
                                                console.log(`🔹 Clic en "Ver Ejercicios" para bloque: ${bloque.id}`);
                                                onOpenEjercicios(bloque.id);
                                            }}
                                        >
                                            Ver Ejercicios
                                        </Button>
                                    </Td>
                                </Tr>
                                );
                            })
                        ) : (
                            <Tr>
                                <Td colSpan={4} className="text-center text-gray-500">
                                    No hay bloques disponibles.
                                </Td>
                            </Tr>
                        )}
                    </TBody>
                </Table>
            )}
        </div>
    );
};

export default SelectBloques;
