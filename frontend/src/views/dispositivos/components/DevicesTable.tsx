import { useState } from 'react';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Pagination from '@/components/ui/Pagination';
import { HiOutlinePencilAlt, HiOutlineTrash } from 'react-icons/hi';
import { Device } from '@/@types/custom/devices';
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    flexRender,
    ColumnDef
} from '@tanstack/react-table';

const { Tr, Th, Td, THead, TBody } = Table;

interface DevicesTableProps {
    data: Device[];
    onDelete: (id: number) => void;
    onEdit: (id: number) => void;
}

const DevicesTable = ({ data, onDelete, onEdit }: DevicesTableProps) => {
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 }); // Tamaño fijo de página: 5

    const columns: ColumnDef<Device>[] = [
        { header: 'ID', accessorKey: 'id', cell: (info) => info.getValue() },
        { header: 'Nombre', accessorKey: 'nombre', cell: (info) => info.getValue() },
        { header: 'Descripción', accessorKey: 'descripcion', cell: (info) => info.getValue() },
        { header: 'Activo', accessorKey: 'activo', cell: (info) => (info.getValue() ? 'Sí' : 'No') },
        {
            header: 'Creado el',
            accessorKey: 'createdAt',
            cell: (info) => {
                const value = info.getValue() as string;
                const date = new Date(value);
                return date.toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                }) + ' ' + date.toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                });
            },
        },
        {
            header: 'Acción',
            cell: ({ row }) => (
                <div className="flex space-x-2">
                    {/* Botón Modificar */}
                    <Button
                        variant="twoTone"
                        color="blue-600"
                        icon={<HiOutlinePencilAlt />}
                        onClick={() => onEdit(row.original.id)}
                    >
                        Modificar
                    </Button>

                    {/* Botón Borrar */}
                    <Button
                        variant="twoTone"
                        color="red-600"
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
        getPaginationRowModel: getPaginationRowModel(),
        state: { pagination },
        onPaginationChange: setPagination,
        manualPagination: false,
        pageCount: Math.ceil(data.length / pagination.pageSize),
    });

    return (
        <div >
            <Table compact>
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
            <div className="flex items-center justify-between mt-4">
                <Pagination
                    pageSize={pagination.pageSize} // Se mantiene fijo en 5
                    currentPage={pagination.pageIndex + 1}
                    total={data.length}
                    onChange={(page) => setPagination({ ...pagination, pageIndex: page - 1 })}
                />
            </div>
        </div>
    );
};

export default DevicesTable;
