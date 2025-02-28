import React from 'react';
import TipoClaseTable from './components/TipoClaseTable';
import Card from '@/components/ui/Card';

const TiposDeClasesListPage: React.FC = () => {
  return (
    <Card header="Listado de Tipos de Clases">
      <TipoClaseTable />
    </Card>
  );
};

export default TiposDeClasesListPage;
