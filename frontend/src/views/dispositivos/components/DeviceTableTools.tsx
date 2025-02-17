import React, { useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';
import Checkbox from '@/components/ui/Checkbox/Checkbox';
import {Device} from '@/@types/custom/devices';

interface DeviceTableToolsProps {
    onSearch: (searchTerm: string, isActive:boolean) => void;
}

const DeviceTableTools = ({ onSearch } : DeviceTableToolsProps) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState<Device['nombre']>('');
    const [onlyActive, setOnlyActive] = useState<Device['activo']>(true);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        onSearch(e.target.value, onlyActive);
    };    

    const handleActive = () => {
        setOnlyActive(!onlyActive);
        onSearch(searchTerm, !onlyActive);
    };

    const handleAddDevice = () => {
        navigate('/dispositivos/nuevo',{replace: true});
    };   

    return (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
            <Checkbox
                checked={onlyActive}
                className="w-full sm:w-auto"
                onChange={handleActive}
            >
                Activos
            </Checkbox>
    
            <Input
                placeholder="Buscar dispositivo..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full sm:w-auto"
            />
            <Button variant="solid" onClick={handleAddDevice}>
                Nuevo Disposistivo
            </Button>
        </div>
    );
};

export default DeviceTableTools;
