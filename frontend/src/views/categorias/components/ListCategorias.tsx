// src/views/categorias/components/ListCategorias.tsx
import React from 'react';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import { useReactTable, getCoreRowModel, ColumnDef, flexRender } from '@tanstack/react-table';
import { deleteCategoriaEjercicio, updateCategoriaEjercicio } from '@/services/CategoriaEjerciciosService';
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
    onEdit: (id: number, data: Partial<Categoria>) => void;
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
            header: 'Actualizado el',
            accessorKey: 'updatedAt',
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
                        variant="link"
                        onClick={() => handleEdit(row.original.id, row.original)}
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

    // Función para manejar la eliminación de una categoría
    const handleDelete = async (id: number) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
            try {
                await deleteCategoriaEjercicio(id);
                onDelete(id); // Actualiza la lista de categorías en el componente padre

                // Mostrar notificación de éxito
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

                // Mostrar notificación de error
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

    // Función para manejar la edición de una categoría
    const handleEdit = async (id: number, data: Partial<Categoria>) => {
        onEdit(id, data);
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
