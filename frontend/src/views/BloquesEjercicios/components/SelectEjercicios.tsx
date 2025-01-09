// frontend/src/views/BloquesEjercicios/components/SelectEjercicios.tsx
import React, { useEffect, useState } from 'react';
import Table from '@/components/ui/Table';
import Checkbox from '@/components/ui/Checkbox';
import { useReactTable, getCoreRowModel, ColumnDef, flexRender } from '@tanstack/react-table';
import Spinner from '@/components/ui/Spinner';
import { apiGetEjercicios } from '@/services/ExerciseService';

const { Tr, Th, Td, THead, TBody } = Table;

interface Exercise {
    id: number;
    nombre: string;
}

interface SelectEjerciciosProps {
    selectedEjercicios: number[];
    onChange: (selectedEjercicios: number[]) => void;
}

const SelectEjercicios: React.FC<SelectEjerciciosProps> = ({ selectedEjercicios, onChange }) => {
    const [ejercicios, setEjercicios] = useState<Exercise[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEjercicios = async () => {
            try {
                const response = await apiGetEjercicios();
                setEjercicios(response.data.data);
            } catch (error) {
                console.error('Error al cargar los ejercicios disponibles:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchEjercicios();
    }, []);

    // ✅ Definir las columnas con `id` explícito
    const columns: ColumnDef<Exercise>[] = [
        {
            id: 'id', // ✅ Necesario para evitar el error
            header: 'ID',
            accessorKey: 'id',
        },
        {
            id: 'nombre', // ✅ Necesario para evitar el error
            header: 'Nombre del ejercicio',
            accessorKey: 'nombre',
        },
        {
            id: 'select', // ✅ Columna para el checkbox
            header: '',
            cell: ({ row }) => (
                <Checkbox
                    checked={selectedEjercicios.includes(row.original.id)}
                    onChange={() => {
                        const newSelected = selectedEjercicios.includes(row.original.id)
                            ? selectedEjercicios.filter((id) => id !== row.original.id)
                            : [...selectedEjercicios, row.original.id];
                        onChange(newSelected);
                    }}
                />
            ),
        },
    ];

    // ✅ Mostrar un spinner mientras los datos se cargan
    if (loading) return <Spinner />;

    return (
        <Table>
            <THead>
                {columns.map((col) => (
                    <Th key={col.id}>{flexRender(col.header, {})}</Th>
                ))}
            </THead>
            <TBody>
                {ejercicios.map((ejercicio) => (
                    <Tr key={ejercicio.id}>
                        {columns.map((col) => (
                            <Td key={col.id}>
                                {col.accessorKey
                                    ? ejercicio[col.accessorKey as keyof Exercise]
                                    : flexRender(col.cell, { row: { original: ejercicio } })}
                            </Td>
                        ))}
                    </Tr>
                ))}
            </TBody>
        </Table>
    );
};

export default SelectEjercicios;
