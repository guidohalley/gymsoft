import React, { useEffect, useState } from 'react';
import Table from '@/components/ui/Table';
import Input from '@/components/ui/Input';
import Checkbox from '@/components/ui/Checkbox';
import { getBloques } from '@/services/BloquesService';

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
}

const SelectBloques: React.FC<SelectBloquesProps> = ({ selectedBloques, onChange }) => {
    const [bloques, setBloques] = useState<Bloque[]>([]);

    useEffect(() => {
        const fetchBloques = async () => {
            try {
                const response = await getBloques();
                setBloques(response.data.data || []);
            } catch (error) {
                console.error('Error al cargar los bloques:', error);
            }
        };
        fetchBloques();
    }, []);

    const handleSelectBloque = (bloque: Bloque, isSelected: boolean) => {
        if (!isSelected) {
            if (!window.confirm('¿Estás seguro de eliminar este bloque de la rutina?')) {
                return;
            }
        }

        const updatedBloques = isSelected
            ? [...selectedBloques, { bloqueId: bloque.id, orden: selectedBloques.length + 1 }]
            : selectedBloques.filter((b) => b.bloqueId !== bloque.id);

        onChange(updatedBloques);
    };

    return (
        <div className="bg-white p-4 rounded shadow mt-4">
            <h3 className="text-lg font-bold mb-4">Seleccionar Bloques</h3>
            <Table>
                <THead>
                    <Tr>
                        <Th>Seleccionar</Th>
                        <Th>Descripción</Th>
                        <Th>Orden</Th>
                    </Tr>
                </THead>
                <TBody>
                    {bloques.map((bloque) => {
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
                                            value={
                                                selectedBloques.find((b) => b.bloqueId === bloque.id)?.orden || 1
                                            }
                                            onChange={(e) =>
                                                onChange(
                                                    selectedBloques.map((b) =>
                                                        b.bloqueId === bloque.id
                                                            ? { ...b, orden: Number(e.target.value) }
                                                            : b
                                                    )
                                                )
                                            }
                                        />
                                    )}
                                </Td>
                            </Tr>
                        );
                    })}
                </TBody>
            </Table>
        </div>
    );
};

export default SelectBloques;
