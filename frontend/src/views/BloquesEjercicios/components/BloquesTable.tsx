import React from 'react';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import { useReactTable, getCoreRowModel, ColumnDef, flexRender } from '@tanstack/react-table';
import { HiOutlinePencilAlt, HiOutlineTrash } from 'react-icons/hi';

const { Tr, Th, Td, THead, TBody } = Table;

interface Bloque {
    id: number;
    descripcion: string;
    orden: number;
    createdAt: string;
}

interface BloquesTableProps {
    data: Bloque[];
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
}

const BloquesTable: React.FC<BloquesTableProps> = ({ data, onEdit, onDelete }) => {
    const columns: ColumnDef<Bloque>[] = [
        {
            header: 'ID',
            accessorKey: 'id',
            cell: (info) => info.getValue(),
        },
        {
            header: 'Descripción',
            accessorKey: 'descripcion',
            cell: (info) => info.getValue(),
        },
        {
            header: 'Orden',
            accessorKey: 'orden',
            cell: (info) => info.getValue(),
        },
        {
            header: 'Creado el',
            accessorKey: 'createdAt',
            cell: (info) => {
                const date = new Date(info.getValue());
                return date.toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                });
            },
        },
        {
            header: 'Acciones',
            cell: ({ row }) => (
                <div className="flex space-x-2">
                    <Button
                        variant="plain"
                        icon={<HiOutlinePencilAlt />}
                        onClick={() => onEdit(row.original.id)}
                    >
                        Editar
                    </Button>
                    <Button
                        variant="plain"
                        className="text-red-500"
                        icon={<HiOutlineTrash />}
                        onClick={() => onDelete(row.original.id)}
                    >
                        Eliminar
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
    );
};

export default BloquesTable;
