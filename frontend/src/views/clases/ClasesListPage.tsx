import React, { useEffect, useState } from 'react';
import { apiGetClases, apiDeleteClase } from '@/services/ClasesService';
import { IClase } from '@/types/clases';
import { useNavigate } from 'react-router-dom';

import Card from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';
import Notification from '@/components/ui/Notification';
import toast from '@/components/ui/toast';

import ClaseTable from './components/ClaseTable';
import ClaseTableTools from './components/ClaseTableTools';

const ClasesListPage: React.FC = () => {
  const [clases, setClases] = useState<IClase[]>([]);
  const [filteredClases, setFilteredClases] = useState<IClase[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchClases = async () => {
      try {
        const response = await apiGetClases();
        const data = response.data.data; // Ajusta según tu backend
        setClases(data);
        setFilteredClases(data);
      } catch (err) {
        setError('No se pudieron cargar las clases');
        toast.push(
          <Notification title="Error" type="danger">
            Ocurrió un problema al cargar las clases.
          </Notification>
        );
      } finally {
        setLoading(false);
      }
    };

    fetchClases();
  }, []);

  const handleSearch = (searchTerm: string) => {
    const lowercasedTerm = searchTerm.toLowerCase();
    const filtered = clases.filter((item) => {
      // Ajustar campos a buscar
      return (
        item.descripcion?.toLowerCase().includes(lowercasedTerm) ||
        item.fechaInicio?.includes(lowercasedTerm) ||
        item.fechaFin?.includes(lowercasedTerm)
      );
    });
    setFilteredClases(filtered);
  };

  const handleCreate = () => {
    navigate('/clases/nueva'); // Ruta para formulario de nueva clase
  };

  const handleEdit = (id: number) => {
    navigate(`/clases/${id}/editar`);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar esta clase?')) return;
    setDeleting(id);
    try {
      await apiDeleteClase(id);
      setClases((prev) => prev.filter((clase) => clase.id !== id));
      setFilteredClases((prev) => prev.filter((clase) => clase.id !== id));
      toast.push(
        <Notification title="Clase eliminada" type="success">
          Se eliminó la clase correctamente.
        </Notification>
      );
    } catch (err) {
      toast.push(
        <Notification title="Error" type="danger">
          No se pudo eliminar la clase.
        </Notification>
      );
    } finally {
      setDeleting(null);
    }
  };

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Listado de Clases</h1>
        <ClaseTableTools onSearch={handleSearch} onCreate={handleCreate} />
      </div>

      {loading ? (
        <Spinner />
      ) : error ? (
        <Notification title="Error al cargar" type="danger">
          {error}
        </Notification>
      ) : filteredClases.length === 0 ? (
        <Card className="text-center py-8">
          <h2 className="text-lg font-bold">No hay clases registradas</h2>
          <p className="text-gray-500">Puedes crear una nueva clase con el botón &quot;Nueva Clase&quot;.</p>
        </Card>
      ) : (
        <ClaseTable
          data={filteredClases}
          onEdit={handleEdit}
          onDelete={handleDelete}
          deleting={deleting}
        />
      )}
    </Card>
  );
};

export default ClasesListPage;