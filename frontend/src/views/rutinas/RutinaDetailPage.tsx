import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiGetRutinaDetails } from '@/services/RutinasService';
import RutinaForm from './components/RutinaForm';
import Card from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';
import Notification from '@/components/ui/Notification';
import toast from '@/components/ui/toast';
import { HiOutlineCheckCircle, HiOutlineExclamationCircle } from 'react-icons/hi';

const RutinaDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const rutinaId = Number(id);
    const [rutina, setRutina] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRutina = async () => {
            try {
                const response = await apiGetRutinaDetails(rutinaId);
                setRutina(response.data.data);
            } catch (error) {
                console.error('Error al cargar la rutina:', error);
                setError('No se pudo cargar la rutina.');
            } finally {
                setLoading(false);
            }
        };

        if (rutinaId) fetchRutina();
        else setLoading(false);
    }, [rutinaId]);

    const handleSuccess = () => {
        toast.push(
            <Notification title="Rutina guardada" type="success" customIcon={<HiOutlineCheckCircle />}>
                Los datos de la rutina han sido guardados correctamente.
            </Notification>
        );
        navigate('/rutinas');
    };

    if (loading) return <Spinner />;

    if (error) {
        return (
            <Notification title="Error" type="danger" customIcon={<HiOutlineExclamationCircle />}>
                {error}
            </Notification>
        );
    }

    return (
        <Card>
            <h2 className="text-xl font-bold mb-4">{rutina ? `Editar Rutina: ${rutina.nombre}` : 'Nueva Rutina'}</h2>
            <RutinaForm rutinaId={rutinaId} onSuccess={handleSuccess} />
        </Card>
    );
};

export default RutinaDetailPage;
