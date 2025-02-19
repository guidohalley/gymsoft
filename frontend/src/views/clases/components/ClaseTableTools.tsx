import React, { useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { HiOutlinePlus } from 'react-icons/hi';

interface ClaseTableToolsProps {
  onSearch: (searchTerm: string) => void;
  onCreate: () => void;
}

const ClaseTableTools: React.FC<ClaseTableToolsProps> = ({
  onSearch,
  onCreate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Search term changed:', e.target.value);
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
      <Input
        placeholder="Buscar clases..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <Button variant="solid" icon={<HiOutlinePlus />} onClick={() => {
        console.log('Creating new class');
        onCreate();
      }}>
        Nueva Clase
      </Button>
    </div>
  );
};

export default ClaseTableTools;