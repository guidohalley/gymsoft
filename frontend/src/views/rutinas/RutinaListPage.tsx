import React, { useEffect, useState } from 'react';
import { apiGetRutinas, apiDeleteRutina } from '@/services/RutinasService';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';
import Notification from '@/components/ui/Notification';
import toast from '@/components/ui/toast';
import RutinaTable from './components/RutinaTable';
import RutinaTableTools from './components/RutinaTableTools';

const RutinaListPage: React.FC = () => {
    const [rutinas, setRutinas] = useState<any[]>([]);
    const [filteredRutinas, setFilteredRutinas] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [deleting, setDeleting] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchRutinas = async () => {
            try {
                const response = await apiGetRutinas();
                setRutinas(response.data.data);
                setFilteredRutinas(response.data.data);
            } catch (error) {
                console.error('Error al cargar rutinas:', error);
                setError('No se pudieron cargar las rutinas.');
                toast.push(
                    <Notification title="Error" type="danger">
                        Ocurrió un problema al cargar las rutinas.
                    </Notification>
                );
            } finally {
                setLoading(false);
            }
        };
        fetchRutinas();
    }, []);

    const handleSearch = (searchTerm: string) => {
        const lowercasedTerm = searchTerm.toLowerCase();
        const filtered = rutinas.filter((rutina) =>
            Object.keys(rutina).some((key) => {
                const value = rutina[key];
                if (typeof value === 'string') {
                    return value.toLowerCase().includes(lowercasedTerm);
                }
                if (typeof value === 'number') {
                    return value.toString().includes(lowercasedTerm);
                }
                return false;
            })
        );
        setFilteredRutinas(filtered);
    };

    const handleCreate = () => {
        navigate('/rutinas/nueva');
    };

    const handleEdit = (rutinaId: number) => {
        navigate(`/rutinas/${rutinaId}/editar`);
    };

    const handleDelete = async (rutinaId: number) => {
        console.log("📡 Intentando eliminar rutina con ID:", rutinaId);
        if (!window.confirm("⚠️ ¿Estás seguro de que deseas eliminar esta rutina? Esta acción no se puede deshacer.")) {
            return;
        }
    
        try {
            await apiDeleteRutina(rutinaId);
            setRutinas((prev) => prev.filter((rutina) => rutina.id !== rutinaId));
            setFilteredRutinas((prev) => prev.filter((rutina) => rutina.id !== rutinaId));
    
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

    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-bold">Listado de Rutinas</h1>
                <RutinaTableTools onSearch={handleSearch} onCreate={handleCreate} />
            </div>

            {loading ? (
                <Spinner />
            ) : error ? (
                <Notification title="Error al cargar" type="danger">
                    {error}
                </Notification>
            ) : filteredRutinas.length === 0 ? (
                <Card className="text-center py-8">
                    <h2 className="text-lg font-bold">No hay rutinas registradas</h2>
                    <p className="text-gray-500">Puedes agregar nuevas rutinas desde el botón "Nueva Rutina".</p>
                </Card>
            ) : (
                <RutinaTable data={filteredRutinas} onEdit={handleEdit} onDelete={handleDelete} deleting={deleting} />
            )}
        </Card>
    );
};

export default RutinaListPage;
