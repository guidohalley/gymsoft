import React, { useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface ExerciseSearchProps {
    onSearch: (query: string) => void;
    onReset: () => void;
}

const ExerciseSearch: React.FC<ExerciseSearchProps> = ({ onSearch, onReset }) => {
    const [searchQuery, setSearchQuery] = useState<string>('');

    const handleSearch = () => {
        onSearch(searchQuery.trim());
    };

    const handleReset = () => {
        setSearchQuery('');
        onReset();
    };

    return (
        <div className="flex items-center gap-2 mb-4">
            <Input
                placeholder="Buscar ejercicios..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button variant="solid" onClick={handleSearch}>
                Buscar
            </Button>
            <Button variant="outline" onClick={handleReset}>
                Restablecer
            </Button>
        </div>
    );
};

export default ExerciseSearch;
