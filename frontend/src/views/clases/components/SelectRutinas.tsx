import React, { useEffect, useState } from 'react';
import { apiGetRutinas } from '@/services/RutinasService';
import { IRutina } from '@/types/rutinas';
import Spinner from '@/components/ui/Spinner';
import Notification from '@/components/ui/Notification';

interface SelectRutinasProps {
  value: number; // rutinaId
  onChange: (rutinaId: number) => void;
}

const SelectRutinas: React.FC<SelectRutinasProps> = ({ value, onChange }) => {
  const [rutinas, setRutinas] = useState<IRutina[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Fetching rutinas...');
    const fetchRutinas = async () => {
      try {
        const response = await apiGetRutinas();
        console.log('Rutinas fetched:', response.data.data);
        setRutinas(response.data.data);
      } catch (err) {
        console.error('Error fetching rutinas:', err);
        setError('No se pudo cargar la lista de rutinas');
      } finally {
        setLoading(false);
      }
    };
    fetchRutinas();
  }, []);

  if (loading) return <Spinner />;
  if (error) {
    return <Notification title="Error" type="danger">{error}</Notification>;
  }

  return (
    <select
      className="border p-2 w-full rounded outline-none"
      value={value}
      onChange={(e) => {
        console.log('Rutina seleccionada:', e.target.value);
        onChange(Number(e.target.value));
      }}
    >
      <option value={0}>Seleccione una rutina</option>
      {rutinas.map((rutina) => (
        <option key={rutina.id} value={rutina.id}>
          {rutina.nombre}
        </option>
      ))}
    </select>
  );
};

export default SelectRutinas;