// src/views/categorias/components/ListCategorias.tsx
import React from 'react';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import { useReactTable, getCoreRowModel, ColumnDef, flexRender } from '@tanstack/react-table';
import { deleteCategoriaEjercicio } from '@/services/CategoriaEjerciciosService';
import toast from '@/components/ui/toast';
import Notification from '@/components/ui/Notification';
import { HiOutlineCheckCircle, HiOutlineExclamationCircle, HiOutlineTrash } from 'react-icons/hi';

const { Tr, Th, Td, THead, TBody } = Table;

interface Categoria {
    id: number;
    nombre: string;
    activo: boolean;
    esGlobal: boolean;
    creadoPor: number;
    gimnasioId: number | null;
    createdAt: string;
    updatedAt: string;
}

interface ListCategoriasProps {
    categorias: Categoria[];
    onDelete: (id: number) => void;
    onEdit: (categoria: Categoria) => void;
}

const ListCategorias: React.FC<ListCategoriasProps> = ({ categorias, onDelete, onEdit }) => {
    const columns: ColumnDef<Categoria>[] = [
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
            header: 'Global',
            accessorKey: 'esGlobal',
            cell: (info) => (info.getValue() ? 'Sí' : 'No'),
        },
        {
            header: 'Creado el',
            accessorKey: 'createdAt',
            cell: (info) => new Date(info.getValue()).toLocaleString('es-ES'),
        },
        {
            header: 'Actualizado el',
            accessorKey: 'updatedAt',
            cell: (info) => new Date(info.getValue()).toLocaleString('es-ES'),
        },
        {
            header: 'Acción',
            cell: ({ row }) => (
                <div className="flex space-x-2">
                    <Button
                        variant="link"
                        onClick={() => onEdit(row.original)}
                    >
                        Modificar
                    </Button>
                    <Button
                        variant="link"
                        className="text-red-500"
                        onClick={() => handleDelete(row.original.id)}
                    >
                        Borrar
                    </Button>
                </div>
            ),
        },
    ];

    const table = useReactTable({
        data: categorias,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const handleDelete = async (id: number) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
            try {
                await deleteCategoriaEjercicio(id);
                onDelete(id);
                toast.push(
                    <Notification
                        title="Categoría eliminada"
                        customIcon={<HiOutlineTrash className="text-2xl text-grey-300" />}
                    >
                        La categoría se ha eliminado exitosamente.
                    </Notification>
                );
            } catch (error) {
                console.error('Error al eliminar la categoría:', error);
                toast.push(
                    <Notification
                        title="Error"
                        customIcon={<HiOutlineTrash className="text-2xl text-red-500" />}
                    >
                        Hubo un error al eliminar la categoría.
                    </Notification>
                );
            }
        }
    };

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

export default ListCategorias;
