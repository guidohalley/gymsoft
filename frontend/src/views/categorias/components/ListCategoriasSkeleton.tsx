// src/views/categorias/components/ListCategoriasSkeleton.tsx
import React from 'react';
import Skeleton from '@/components/ui/Skeleton';

const ListCategoriasSkeleton: React.FC = () => {
    const rows = Array.from({ length: 5 }); // Número de filas de esqueleto a mostrar

    return (
        <div className="bg-white p-4 rounded shadow mt-4">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nombre
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Global
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Creado el
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actualizado el
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acción
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {rows.map((_, index) => (
                            <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Skeleton className="h-6 w-16" />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Skeleton className="h-6 w-32" />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Skeleton className="h-6 w-16" />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Skeleton className="h-6 w-32" />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Skeleton className="h-6 w-32" />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Skeleton className="h-6 w-24" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ListCategoriasSkeleton;
