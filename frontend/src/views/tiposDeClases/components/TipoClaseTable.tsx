import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '@/components/ui/Table';
import { HiOutlinePencilAlt, HiOutlineTrash } from 'react-icons/hi';
import Button from '@/components/ui/Button';
import { apiGetTiposClases, apiDeleteTipoClase } from '@/services/TipoClaseService';
import toast from '@/components/ui/toast';
import Notification from '@/components/ui/Notification';

const { Tr, Th, Td, THead, TBody } = Table;

interface TipoClase {
    id: number;
    descripcion: string;
    esGlobal: boolean;
}

const TipoClaseTable: React.FC = () => {
    const [tiposClases, setTiposClases] = useState<TipoClase[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTiposClases = async () => {
            try {
                const response = await apiGetTiposClases();
                setTiposClases(response.data.data);
            } catch (err) {
                console.error('Error al obtener los tipos de clases:', err);
            }
        };
        fetchTiposClases();
    }, []);

    const handleEdit = (tipoClaseId: number) => {
        navigate(`/clases/tipo/${tipoClaseId}/editar`);
    };

    const handleDelete = async (tipoClaseId: number) => {
        if (!window.confirm("⚠️ ¿Estás seguro de que deseas eliminar este tipo de clase? Esta acción no se puede deshacer.")) {
            return;
        }

        try {
            await apiDeleteTipoClase(tipoClaseId);
            setTiposClases((prev) => prev.filter((tipoClase) => tipoClase.id !== tipoClaseId));

            toast.push(
                <Notification title="Éxito" type="success">
                    ✅ Tipo de clase eliminado correctamente.
                </Notification>
            );
        } catch (error) {
            console.error("❌ Error al eliminar el tipo de clase:", error);
            toast.push(
                <Notification title="Error" type="danger">
                    ❌ No se pudo eliminar el tipo de clase. Verifica que no esté en uso.
                </Notification>
            );
        }
    };

    const columns = useMemo(
        () => [
            { header: "ID", accessorKey: "id" },
            { header: "Descripción", accessorKey: "descripcion" },
            { header: "Es Global", accessorKey: "esGlobal" },
            {
                id: "actions",
                header: "Acciones",
                cell: ({ row }: { row: any }) => (
                    <div className="flex space-x-2">
                        <Button
                            size="xs"
                            variant="outline"
                            onClick={() => handleEdit(row.original.id)}
                        >
                            <HiOutlinePencilAlt /> Editar
                        </Button>
                        <Button
                            size="xs"
                            variant="destructive"
                            onClick={() => handleDelete(row.original.id)}
                        >
                            <HiOutlineTrash /> Eliminar
                        </Button>
                    </div>
                ),
            },
        ],
        []
    );

    return (
        <Table>
            <THead>
                <Tr>
                    {columns.map((col) => (
                        <Th key={col.id || col.accessorKey}>{col.header}</Th>
                    ))}
                </Tr>
            </THead>
            <TBody>
                {tiposClases.map((tipoClase) => (
                    <Tr key={tipoClase.id}>
                        <Td>{tipoClase.id}</Td>
                        <Td>{tipoClase.descripcion}</Td>
                        <Td>{tipoClase.esGlobal ? 'Sí' : 'No'}</Td>
                        <Td>
                            <div className="flex gap-2">
                                <Button
                                    className="mr-2"
                                    variant="twoTone"
                                    color="blue-600"
                                    icon={<HiOutlinePencilAlt />}
                                    onClick={() => handleEdit(tipoClase.id)}
                                >
                                    Editar
                                </Button>
                                <Button
                                    variant="twoTone"
                                    color="red-600"
                                    icon={<HiOutlineTrash />}
                                    onClick={() => handleDelete(tipoClase.id)}
                                >
                                    Eliminar
                                </Button>
                            </div>
                        </Td>
                    </Tr>
                ))}
            </TBody>
        </Table>
    );
};

export default TipoClaseTable;
