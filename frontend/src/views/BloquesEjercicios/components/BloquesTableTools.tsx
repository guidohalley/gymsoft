import React, { useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { HiOutlinePlus } from 'react-icons/hi';

interface BloquesTableToolsProps {
    onSearch: (searchTerm: string) => void;
    onCreate: () => void;
}

const BloquesTableTools: React.FC<BloquesTableToolsProps> = ({ onSearch, onCreate }) => {
    const [searchTerm, setSearchTerm] = useState<string>('');

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        onSearch(e.target.value);
    };

    return (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
            {/* Campo de búsqueda */}
            <Input
                placeholder="Buscar bloques..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full sm:w-auto"
            />
            {/* Botón "Nuevo Bloque" */}
            <Button variant="solid" icon={<HiOutlinePlus />} onClick={onCreate}>
                Nuevo Bloque
            </Button>
        </div>
    );
};

export default BloquesTableTools;
