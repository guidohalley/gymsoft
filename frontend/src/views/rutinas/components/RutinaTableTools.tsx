import React, { useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { HiOutlinePlus } from 'react-icons/hi';

interface RutinaTableToolsProps {
    onSearch: (searchTerm: string) => void;
    onCreate: () => void;
}

const RutinaTableTools: React.FC<RutinaTableToolsProps> = ({ onSearch, onCreate }) => {
    const [searchTerm, setSearchTerm] = useState<string>('');

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        onSearch(e.target.value);
    };

    return (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
            {/* Campo de búsqueda */}
            <Input
                placeholder="Buscar rutinas..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full sm:w-auto"
            />
            {/* Botón "Nueva Rutina" */}
            <Button variant="solid" icon={<HiOutlinePlus />} onClick={onCreate}>
                Nueva Rutina
            </Button>
        </div>
    );
};

export default RutinaTableTools;
