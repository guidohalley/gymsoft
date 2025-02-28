import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBloqueById } from '@/services/BloquesService';
import BloquesForm from './components/BloquesForm';
import Card from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';
import Notification from '@/components/ui/Notification';
import toast from '@/components/ui/toast';
import { HiOutlineCheckCircle, HiOutlineExclamationCircle } from 'react-icons/hi';

const BloquesDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const bloqueId = Number(id);
    const [bloque, setBloque] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isNaN(bloqueId) || bloqueId <= 0) {
            console.error('ID de bloque no válido:', id);
            setError('ID de bloque no válido.');
            setLoading(false);
            return;
        }

        const fetchBloque = async () => {
            try {
                const response = await getBloqueById(bloqueId);
                setBloque(response.data.data);
            } catch (error) {
                console.error('Error al cargar el bloque:', error);
                setError('No se pudo cargar el bloque.');
            } finally {
                setLoading(false);
            }
        };
        fetchBloque();
    }, [bloqueId]);

    const handleSuccess = () => {
        toast.push(
            <Notification
                title="Bloque actualizado"
                type="success"
                customIcon={<HiOutlineCheckCircle />}
            >
                Los datos del bloque han sido actualizados correctamente.
            </Notification>,
        );
        navigate('/bloques');
    };

    if (loading) {
        return <Spinner />;
    }

    if (error) {
        return (
            <Notification
                title="Error"
                type="danger"
                customIcon={<HiOutlineExclamationCircle />}
            >
                {error}
            </Notification>
        );
    }

    return (
        <Card>
            <h2 className="text-xl font-bold mb-4">
                {bloque ? `Editar Bloque: ${bloque.descripcion}` : 'Nuevo Bloque'}
            </h2>
            <BloquesForm
                initialValues={bloque}
                bloqueId={bloqueId}
                onSuccess={handleSuccess}
            />
        </Card>
    );
};

export default BloquesDetailPage;