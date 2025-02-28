import React, { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Table from '@/components/ui/Table'
import { HiOutlinePencilAlt, HiOutlineTrash } from 'react-icons/hi'
import Button from '@/components/ui/Button'
import { HiOutlinePencil} from 'react-icons/hi'
import { apiGetRutinas } from '@/services/RutinasService'
import { apiDeleteRutina } from '@/services/RutinasService';
import toast from '@/components/ui/toast';
import Notification from '@/components/ui/Notification';

const { Tr, Th, Td, THead, TBody } = Table

interface Rutina {
    id: number
    nombre: string
    descripcion: string
    estadoId: number
    creadoPor: number
    createdAt: string
}

const RutinaTable: React.FC = () => {
    const [rutinas, setRutinas] = useState<Rutina[]>([])
    const navigate = useNavigate()

    useEffect(() => {
        const fetchRutinas = async () => {
            try {
                const response = await apiGetRutinas()
                setRutinas(response.data.data)
            } catch (err) {
            }
        }
        fetchRutinas()
    }, [])

    const handleEdit = (rutinaId: number) => {
        navigate(`/rutinas/editar/${rutinaId}`) // 🔹 Redirige al formulario de edición
    }

    const handleDelete = async (rutinaId: number) => {
        if (!window.confirm("⚠️ ¿Estás seguro de que deseas eliminar esta rutina? Esta acción no se puede deshacer.")) {
            return;
        }
    
        try {
            console.log(`🗑 Eliminando rutina ${rutinaId}`);
            await apiDeleteRutina(rutinaId); // 🔥 Llamamos a la API para eliminar la rutina
    
            // 🔹 Actualizamos la lista eliminando la rutina borrada
            setRutinas((prev) => prev.filter((rutina) => rutina.id !== rutinaId));
    
            toast.push(
                <Notification title="Éxito" type="success">
                    ✅ Rutina eliminada correctamente.
                </Notification>
            );
        } catch (error) {
            console.error("❌ Error al eliminar la rutina:", error);
            toast.push(
                <Notification title="Error" type="danger">
                    ❌ No se pudo eliminar la rutina. Verifica que no esté en uso.
                </Notification>
            );
        }
    };

    const columns = useMemo(
        () => [
            { header: "ID", accessorKey: "id" },
            { header: "Nombre", accessorKey: "nombre" },
            { header: "Descripción", accessorKey: "descripcion" },
            { header: "Estado", accessorKey: "estadoId" },
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
                {rutinas.map((rutina) => (
                    <Tr key={rutina.id}>
                        <Td>{rutina.id}</Td>
                        <Td>{rutina.nombre}</Td>
                        <Td>{rutina.descripcion}</Td>
                        <Td>{rutina.estadoId}</Td>
                        <Td>
                            <div className="flex gap-2">
                                <Button
                                    className="mr-2"
                                    variant="twoTone"
                                    color="blue-600"
                                    icon={<HiOutlinePencil />}
                                    onClick={() => handleEdit(rutina.id)}
                                >
                                    Editar
                                </Button>
                                <Button
                                    variant="twoTone"
                                    color="red-600"
                                    icon={<HiOutlineTrash />}
                                    onClick={() => handleDelete(rutina.id)}
                                >
                                    Eliminar
                                </Button>
                            </div>
                        </Td>
                    </Tr>
                ))}
            </TBody>
        </Table>
    )
}

export default RutinaTable
