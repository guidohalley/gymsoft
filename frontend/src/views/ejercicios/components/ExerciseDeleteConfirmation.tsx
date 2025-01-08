import React from 'react';
import Modal from '@/components/ui/Modal/Modal';
import Button from '@/components/ui/Button';

interface ExerciseDeleteConfirmationProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const ExerciseDeleteConfirmation: React.FC<ExerciseDeleteConfirmationProps> = ({
    isOpen,
    onClose,
    onConfirm,
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2 className="text-lg font-bold mb-4">Confirmar eliminación</h2>
            <p>¿Estás seguro de que deseas eliminar este ejercicio?</p>
            <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={onClose}>
                    Cancelar
                </Button>
                <Button variant="danger" onClick={onConfirm}>
                    Eliminar
                </Button>
            </div>
        </Modal>
    );
};

export default ExerciseDeleteConfirmation;
