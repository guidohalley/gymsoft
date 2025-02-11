import React, { useState } from 'react';
import { FormItem } from '@/components/ui/Form';
import Button from '@/components/ui/Button';
import Notification from '@/components/ui/Notification';
import toast from '@/components/ui/toast';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

interface ExerciseUploadProps {
    onChange: (file: File | null) => void;
    value: File | null;
    maxFileSizeMB?: number;
    renameFile?: (originalName: string) => string;
}

const ExerciseUpload: React.FC<ExerciseUploadProps> = ({
    onChange,
    value,
    maxFileSizeMB = 5,
    renameFile,
}) => {
    const [fileName, setFileName] = useState(value ? value.name : '');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const maxSizeInBytes = maxFileSizeMB * 1024 * 1024;
            if (file.size > maxSizeInBytes) {
                toast.push(
                    <Notification
                        title="Archivo demasiado grande"
                        customIcon={<HiOutlineExclamationCircle className="text-red-500 text-xl" />}
                        type="danger"
                    >
                        El archivo excede el tamaño máximo permitido de {maxFileSizeMB} MB.
                    </Notification>
                );
                return;
            }
    
            // Verificar si el nuevo archivo es el mismo que el actual
            if (value && file.name === value.name && file.size === value.size) {
                return; // Evita actualizar si es el mismo archivo
            }
    
            const newName = renameFile
                ? renameFile(file.name)
                : `archivo-${Date.now()}.${file.name.split('.').pop()}`;
            const renamedFile = new File([file], newName, { type: file.type });
    
            setFileName(renamedFile.name);
            onChange(renamedFile);
        }
    };

    const handleRemoveFile = () => {
        setFileName('');
        onChange(null);
    };

    return (
        <FormItem >
            {fileName ? (
                <div className="flex items-center gap-2">
                    <span className="text-sm truncate max-w-xs">{fileName}</span>
                    <Button variant="default" size="sm" onClick={handleRemoveFile}>
                        Quitar
                    </Button>
                </div>
            ) : (
                <label className="block m-2">
                    <span className="sr-only">Seleccionar archivo</span>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        accept="video/*,image/*"
                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                    />
                </label>
            )}
        </FormItem>
    );
};

export default ExerciseUpload;
