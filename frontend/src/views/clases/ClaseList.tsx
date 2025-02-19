import React, { useEffect, useState } from 'react';
import { apiGetClases } from '@/services/ClasesService';
import { IClase } from '@/types/clases';
import ClaseTable from './ClaseTable';
import Spinner from '@/components/ui/Spinner';
import Notification from '@/components/ui/Notification';

const ClaseList: React.FC = () => {
    const [data, setData] = useState<IClase[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiGetClases();
                setData(response.data);
            } catch (err) {
                setError('No se pudieron cargar las clases');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <Spinner />;
    if (error) {
        return (
            <Notification title="Error" type="danger">
                {error}
            </Notification>
        );
    }

    return <ClaseTable data={data} />;
};

export default ClaseList;
