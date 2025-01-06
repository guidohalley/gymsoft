import React from 'react';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import { HiOutlineTrash } from 'react-icons/hi';
import { deleteEjercicioFromBloque } from '@/services/BloquesService';
import toast from '@/components/ui/toast';
import Notification from '@/components/ui/Notification';

const { Tr, Th, Td, THead, TBody } = Table;

interface Exercise {
    id: number;
    nombre: string;
    series: number;
    repeticiones: string;
    descanso: number;
}

interface ExerciseListInBlockProps {
    ejercicios: Exercise[];
    bloqueId: number;
}

const ExerciseListInBlock: React.FC<ExerciseListInBlockProps> = ({ ejercicios, bloqueId }) => {
    const handleDelete = async (exerciseId: number) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este ejercicio del bloque?')) {
            try {
                await deleteEjercicioFromBloque(bloqueId, exerciseId);
                toast.push(
                    <Notification title="Ejercicio eliminado" type="success">
                        El ejercicio fue eliminado del bloque.
                    </Notification>
                );
            } catch (error) {
                console.error('Error al eliminar el ejercicio:', error);
                toast.push(
                    <Notification title="Error" type="danger">
                        Ocurrió un problema al eliminar el ejercicio.
                    </Notification>
                );
            }
        }
    };

    return (
        <Table>
            <THead>
                <Tr>
                    <Th>ID</Th>
                    <Th>Nombre</Th>
                    <Th>Series</Th>
                    <Th>Repeticiones</Th>
                    <Th>Descanso</Th>
                    <Th>Acciones</Th>
                </Tr>
            </THead>
            <TBody>
                {ejercicios.map((ejercicio) => (
                    <Tr key={ejercicio.id}>
                        <Td>{ejercicio.id}</Td>
                        <Td>{ejercicio.nombre}</Td>
                        <Td>{ejercicio.series}</Td>
                        <Td>{ejercicio.repeticiones}</Td>
                        <Td>{ejercicio.descanso} seg</Td>
                        <Td>
                            <Button
                                variant="plain"
                                className="text-red-500"
                                icon={<HiOutlineTrash />}
                                onClick={() => handleDelete(ejercicio.id)}
                            >
                                Eliminar
                            </Button>
                        </Td>
                    </Tr>
                ))}
            </TBody>
        </Table>
    );
};

export default ExerciseListInBlock;
