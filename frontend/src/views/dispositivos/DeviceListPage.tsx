import {apiGetDevices,apiDeleteDevice} from '@/services/DevicesService';
import { useState,useEffect } from 'react';
import {Device} from '@/@types/custom/devices';
import DevicesTable from './components/DevicesTable';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import Card from '@/components/ui/Card';
import DeviceTableTools from './components/DeviceTableTools';

const DeviceListPage = () => {
    const [devices,setDevices] = useState<Device[]>([]);
    const [filteredDevices,setFilteredDevices] = useState<Device[]>([]);
    const [deviceSelected,setDeviceSelected] = useState<number | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDevices();
    },[]);

    const fetchDevices = async () => {
        try {
            const response = await apiGetDevices();
            const devices = response.data.data;
            setDevices(devices);
            const onlyActive = devices.filter((device) => device.activo);
            setFilteredDevices(onlyActive);
        }catch (error) {
            console.error(error);
        }
    }

    const handleDelete = (id: number) => {
        setDeviceSelected(id);
    }

    const handleEdit = async (id: number) => {
        navigate(`/dispositivos/editar/${id}`);
    }   

    const handleCerrarModal = () => {
        setDeviceSelected(null);
    }

    const handleSearch = (searchTerm: string, isActive: boolean) => {
        let filtered = devices;
    
        filtered = filtered.filter((device) => device.activo === isActive);
    
        filtered = filtered.filter((device) =>
            device.nombre.toLowerCase().includes(searchTerm.toLowerCase())
        );
    
        setFilteredDevices(filtered);
    };

    const handleConfirmacionModal = async () => {
        if(!deviceSelected){
           return;
        }

        try{
            const response = await apiDeleteDevice(deviceSelected);

            if(response.status !== 200){
                throw new Error("Algo salio mal al intentar eliminar el dispositivo");
            }

            setDeviceSelected(null);
            fetchDevices();
        }catch(error){
            console.error(error);
            throw new Error('Algo salio mal al intentar eliminar el dispositivo');
        }          
    }

    return (
        <>
        <Card>
             <div className="flex justify-between items-center ">
                <h1 className="text-xl font-bold">Listado de Dispositivos</h1>
                <DeviceTableTools onSearch={handleSearch}  />            
            </div>
            {
                devices.length > 0 ? (
                    <DevicesTable
                        data={filteredDevices}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                    />
                ) : (
                    <Card className="text-center py-8">
                    <h2 className="text-lg font-bold">No hay dispositivos registrados</h2>
                    <p className="text-gray-500">
                        Puedes agregar nuevos dispositivos desde el botón "Nuevo Dispositivo".
                    </p>
                </Card>
                )
            }
            </Card>
            <ConfirmDialog
                isOpen={deviceSelected ? true : false}
                type="danger"
                confirmButtonColor="red"
                title="Eliminar dispositivo"
                onCancel={handleCerrarModal}
                onConfirm={handleConfirmacionModal}
                cancelText="Cancelar"
                confirmText="Eliminar"
            >
                <p>¿Estás seguro que deseas eliminar el dispositivo?</p>
            </ConfirmDialog>
        </>
    );
};

export default DeviceListPage;