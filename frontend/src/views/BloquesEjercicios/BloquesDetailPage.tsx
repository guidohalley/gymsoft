import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getBloqueById, updateBloque } from '@/services/BloquesService';
import BloquesForm from './components/BloquesForm';
import Card from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';
import Notification from '@/components/ui/Notification';
import ExerciseListInBlock from './components/ExerciseListInBlock';
import toast from '@/components/ui/toast';

const BloquesDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [bloque, setBloque] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBloque = async () => {
            try {
                const response = await getBloqueById(Number(id));
                setBloque(response.data);
                setError(null);
            } catch (error) {
                console.error('Error al cargar el bloque:', error);
                setError('No se pudo cargar el bloque.');
                toast.push(
                    <Notification title="Error" type="danger">
                        Ocurrió un problema al cargar el bloque.
                    </Notification>,
                    { placement: 'top-center' },
                );
            } finally {
                setLoading(false);
            }
        };

        fetchBloque();
    }, [id]);

    const handleUpdate = async (values: any) => {
        try {
            await updateBloque(Number(id), values);
            toast.push(
                <Notification title="Bloque actualizado" type="success">
                    El bloque fue actualizado correctamente.
                </Notification>,
                { placement: 'top-center' },
            );
        } catch (error) {
            console.error('Error al actualizar el bloque:', error);
            toast.push(
                <Notification title="Error" type="danger">
                    Ocurrió un problema al actualizar el bloque.
                </Notification>,
                { placement: 'top-center' },
            );
        }
    };

    return (
        <Card>
            {loading ? (
                <Spinner />
            ) : error ? (
                <Notification title="Error al cargar" type="danger">
                    {error}
                </Notification>
            ) : (
                <div>
                    <h1 className="text-xl font-bold mb-4">Detalle del Bloque: {bloque?.descripcion}</h1>
                    <BloquesForm initialValues={bloque} onSuccess={() => setBloque(bloque)} />
                    <h2 className="text-lg font-bold mt-8 mb-4">Ejercicios Asignados</h2>
                    <ExerciseListInBlock ejercicios={bloque?.ejercicios || []} bloqueId={Number(id)} />
                </div>
            )}
        </Card>
    );
};

export default BloquesDetailPage;
