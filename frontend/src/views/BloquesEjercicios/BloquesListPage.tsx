import React, { useEffect, useState } from 'react';
import { getBloques, deleteBloque } from '@/services/BloquesService';
import BloquesTable from './components/BloquesTable';
import BloquesTableTools from './components/BloquesTableTools';
import Card from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';
import Notification from '@/components/ui/Notification';
import toast from '@/components/ui/toast';
import Button from '@/components/ui/Button';

const BloquesListPage: React.FC = () => {
    const [bloques, setBloques] = useState<any[]>([]);
    const [filteredBloques, setFilteredBloques] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBloques = async () => {
            try {
                const response = await getBloques();
                setBloques(response.data);
                setFilteredBloques(response.data);
            } catch (error) {
                console.error('Error al cargar los bloques:', error);
                setError('No se pudieron cargar los bloques.');
                toast.push(
                    <Notification title="Error" type="danger">
                        Ocurrió un problema al cargar los bloques.
                    </Notification>,
                    { placement: 'top-center' }
                );
            } finally {
                setLoading(false);
            }
        };
        fetchBloques();
    }, []);

    const handleSearch = (searchTerm: string) => {
        const lowercasedTerm = searchTerm.toLowerCase();
        const filtered = bloques.filter((bloque) =>
            Object.keys(bloque).some((key) => {
                const value = bloque[key];
                if (value && typeof value === 'string') {
                    return value.toLowerCase().includes(lowercasedTerm);
                }
                if (value && typeof value === 'number') {
                    return value.toString().toLowerCase().includes(lowercasedTerm);
                }
                return false;
            })
        );
        setFilteredBloques(filtered);
    };

    // Confirmación de eliminación 
    const handleDelete = async (id: number) => {
        const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este bloque?');
        if (confirmDelete) {
            try {
                await deleteBloque(id);
                setFilteredBloques((prev) => prev.filter((bloque) => bloque.id !== id));
                toast.push(
                    <Notification title="Éxito" type="success">
                        El bloque ha sido eliminado correctamente.
                    </Notification>
                );
            } catch (error) {
                toast.push(
                    <Notification title="Error" type="danger">
                        Ocurrió un error al intentar eliminar el bloque.
                    </Notification>
                );
            }
        }
    };

    const handleCreate = () => {
        window.location.href = '/bloques-ejercicios/nuevo';
    };

    const handleEdit = (id: number) => {
        window.location.href = `/bloques-ejercicios/${id}/editar`;
    };

    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-bold">Listado de Bloques de Ejercicios</h1>
                <BloquesTableTools onSearch={handleSearch} onCreate={handleCreate} />
            </div>
            {loading ? (
                <Spinner />
            ) : error ? (
                <Notification title="Error al cargar" type="danger">
                    {error}
                </Notification>
            ) : filteredBloques.length === 0 ? (
                <Card className="text-center py-8">
                    <h2 className="text-lg font-bold">No hay bloques registrados</h2>
                    <p className="text-gray-500">Puedes agregar nuevos bloques desde el botón "Nuevo Bloque".</p>
                </Card>
            ) : (
                <BloquesTable data={filteredBloques} onEdit={handleEdit} onDelete={handleDelete} />
            )}
        </Card>
    );
};

export default BloquesListPage;
