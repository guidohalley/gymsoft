import React from 'react';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import { HiOutlinePencilAlt, HiOutlineTrash } from 'react-icons/hi';
import { IClase } from '@/types/clases';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const { Tr, Th, Td, THead, TBody } = Table;

interface ClaseTableProps {
  data: IClase[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  deleting?: number | null;
}

const ClaseTable: React.FC<ClaseTableProps> = ({
  data,
  onEdit,
  onDelete,
  deleting,
}) => {
  return (
    <Table>
      <THead>
        <Tr>
          <Th>ID</Th>
          <Th>Descripción</Th>
          <Th>Fecha Inicio</Th>
          <Th>Fecha Fin</Th>
          <Th>Tipo Clase</Th>
          <Th>Rutina</Th>
          <Th>Acciones</Th>
        </Tr>
      </THead>
      <TBody>
        {data.map((clase) => (
          <Tr key={clase.id}>
            <Td>{clase.id}</Td>
            <Td>{clase.descripcion}</Td>
            <Td>{dayjs(clase.fechaInicio).tz(dayjs.tz.guess()).format('DD-MM-YYYY')}</Td>
            <Td>{dayjs(clase.fechaFin).tz(dayjs.tz.guess()).format('DD-MM-YYYY')}</Td>
            <Td>{clase.tipoClaseId}</Td>
            <Td>{clase.rutinaId}</Td>
            <Td>
              <div className="flex gap-2">
                <Button
                  size="xs"
                  variant="twoTone"
                  color="blue-600"
                  icon={<HiOutlinePencilAlt />}
                  onClick={() => onEdit(clase.id!)}
                >
                  Editar
                </Button>
                <Button
                  size="xs"
                  variant="twoTone"
                  color="red-600"
                  icon={<HiOutlineTrash />}
                  loading={clase.id === deleting}
                  onClick={() => onDelete(clase.id!)}
                >
                  Eliminar
                </Button>
              </div>
            </Td>
          </Tr>
        ))}
      </TBody>
    </Table>
  );
};

export default ClaseTable;