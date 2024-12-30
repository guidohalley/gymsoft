import React from 'react';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import { useReactTable, getCoreRowModel, ColumnDef, flexRender } from '@tanstack/react-table';
import toast from '@/components/ui/toast';
import Notification from '@/components/ui/Notification';
import { HiOutlinePencilAlt, HiOutlineTrash } from 'react-icons/hi';

const { Tr, Th, Td, THead, TBody } = Table;

interface Exercise {
    id: number;
    nombre: string;
    descripcion: string;
    activo: boolean;
    categoriaEjercicioId: number;
    creadoPor: number;
    gimnasioId: number | null;
    createdAt: string;
    updatedAt: string;
}

interface ExerciseTableProps {
    data: Exercise[];
    onDelete: (id: number) => void;
    onEdit: (id: number) => void;
}

const ExerciseTable: React.FC<ExerciseTableProps> = ({ data, onDelete, onEdit }) => {
    const columns: ColumnDef<Exercise>[] = [
        {
            header: 'ID',
            accessorKey: 'id',
            cell: (info) => info.getValue(),
        },
        {
            header: 'Nombre',
            accessorKey: 'nombre',
            cell: (info) => info.getValue(),
        },
        {
            header: 'Descripción',
            accessorKey: 'descripcion',
            cell: (info) => info.getValue(),
        },
        {
            header: 'Activo',
            accessorKey: 'activo',
            cell: (info) => (info.getValue() ? 'Sí' : 'No'),
        },
        {
            header: 'Creado el',
            accessorKey: 'createdAt',
            cell: (info) => {
                const date = new Date(info.getValue());
                const formattedDate = date.toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                });
                const formattedTime = date.toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                });
                return `${formattedDate} ${formattedTime}`;
            },
        },
        {
            header: 'Acción',
            cell: ({ row }) => (
                <div className="flex space-x-2">
                    <Button
                        variant="plain"
                        icon={<HiOutlinePencilAlt />}
                        onClick={() => onEdit(row.original.id)}
                    >
                        Modificar
                    </Button>
                    <Button
                        variant="plain"
                        className="text-red-500"
                        icon={<HiOutlineTrash />}
                        onClick={() => onDelete(row.original.id)}
                    >
                        Borrar
                    </Button>
                </div>
            ),
        },
    ];

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="bg-white p-4 rounded shadow mt-4">
            <Table>
                <THead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <Tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <Th key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(header.column.columnDef.header, header.getContext())}
                                </Th>
                            ))}
                        </Tr>
                    ))}
                </THead>
                <TBody>
                    {table.getRowModel().rows.map((row) => (
                        <Tr key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <Td key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </Td>
                            ))}
                        </Tr>
                    ))}
                </TBody>
            </Table>
        </div>
    );
};

export default ExerciseTable;
