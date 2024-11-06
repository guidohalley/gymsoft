// src/views/categorias/components/FormCategoriasSkeleton.tsx
import React from 'react';
import Skeleton from '@/components/ui/Skeleton';

const FormCategoriasSkeleton: React.FC = () => {
    return (
        <div className="p-4 bg-white shadow-md rounded-lg">
            <div className="mb-4">
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-10 w-full" />
            </div>
            <div className="mb-4">
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-10 w-full" />
            </div>
            <div className="flex space-x-2">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
            </div>
        </div>
    );
};

export default FormCategoriasSkeleton;
