import React from 'react';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { HiOutlinePencilAlt, HiOutlineTrash } from 'react-icons/hi';
import { useReactTable, getCoreRowModel, ColumnDef, flexRender } from '@tanstack/react-table';

const { Tr, Th, Td, THead, TBody } = Table;

interface Rutina {
    id: number;
    nombre: string;
    descripcion: string;
    estado: string;
    createdAt: string;
}

interface RutinaTableProps {
    data: Rutina[];
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    deleting?: number | null;
}

const RutinaTable: React.FC<RutinaTableProps> = ({ data, onEdit, onDelete, deleting }) => {
    const columns: ColumnDef<Rutina>[] = [
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
            header: 'Estado',
            accessorKey: 'estado',
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
            cell: ({ row }) => {
                const rutinaId = row.original.id;
                const isDeleting = deleting === rutinaId;

                return (
                    <div className="flex space-x-2">
                        <Button variant="plain" icon={<HiOutlinePencilAlt />} onClick={() => onEdit(rutinaId)} disabled={isDeleting}>
                            Editar
                        </Button>
                        <Button
                            variant="plain"
                            className="text-red-500"
                            icon={isDeleting ? <Spinner size="sm" /> : <HiOutlineTrash />}
                            onClick={() => onDelete(rutinaId)}
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Eliminando...' : 'Eliminar'}
                        </Button>
                    </div>
                );
            },
        },
    ];

    const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });

    return (
        <Table>
            <THead>
                {table.getHeaderGroups().map((headerGroup) => (
                    <Tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                            <Th key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</Th>
                        ))}
                    </Tr>
                ))}
            </THead>
            <TBody>
                {table.getRowModel().rows.map((row) => (
                    <Tr key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                            <Td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Td>
                        ))}
                    </Tr>
                ))}
            </TBody>
        </Table>
    );
};

export default RutinaTable;
