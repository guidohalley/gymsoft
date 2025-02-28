import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiGetClaseById } from '@/services/ClasesService';
import Card from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';
import Notification from '@/components/ui/Notification';
import { IClase } from '@/types/clases';
import Button from '@/components/ui/Button';

const ClaseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [clase, setClase] = useState<IClase | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchClase = async () => {
      try {
        const res = await apiGetClaseById(Number(id));
        setClase(res.data.data);
      } catch (err) {
        setError('No se pudo cargar la clase.');
      } finally {
        setLoading(false);
      }
    };
    fetchClase();
  }, [id]);

  if (loading) return <Spinner />;
  if (error) {
    return (
      <Notification title="Error" type="danger">
        {error}
      </Notification>
    );
  }

  return (
    <Card>
      <h2 className="text-xl font-bold mb-4">
        Detalle de Clase {clase?.id}
      </h2>
      {clase && (
        <div className="space-y-2">
          <p><strong>Descripción:</strong> {clase.descripcion}</p>
          <p><strong>Fecha Inicio:</strong> {clase.fechaInicio}</p>
          <p><strong>Fecha Fin:</strong> {clase.fechaFin}</p>
          <p><strong>TipoClaseId:</strong> {clase.tipoClaseId}</p>
          <p><strong>RutinaId:</strong> {clase.rutinaId}</p>
        </div>
      )}
      <div className="mt-4">
        <Button variant="solid" onClick={() => navigate('/clases/listado')}>
          Volver al listado
        </Button>
      </div>
    </Card>
  );
};

export default ClaseDetailPage;