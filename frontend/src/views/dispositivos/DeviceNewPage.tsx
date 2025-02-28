import DeviceForm from './components/DeviceForm';
import {apiCreateDevice,apiEditDevice,apiGetDeviceById} from '@/services/DevicesService';
import {NewDevice,Device} from '@/@types/custom/devices';
import { useParams } from 'react-router-dom';
import { useEffect,useState} from 'react';

const DeviceNewPage = () => {
    const { id } = useParams();
    const [device,setDevice] = useState<Device | null>(null);

    useEffect(() => {
        if(id){
            try {
                fetchDevice(Number(id));
            }
            catch (error) {
                console.error(error);
            }
        }
    }
    , []);

    const fetchDevice = async(id: number) => {
        const response = await apiGetDeviceById(id);
        if(!response.data.ok){
            throw new Error('Algo salio mal');
        }
        setDevice(response.data.data);
    };

    const handleNewDevice = async(data: NewDevice) => {
        const response = await apiCreateDevice(data);
        
        if(!response.data.ok){
            throw new Error('Algo salio mal al crear el dispositivo');
        }
    };

    const handleEditDevice = async (device: any) => {
        const response = await apiEditDevice(Number(id),device);
        
        if(!response.data.ok){
            throw new Error('Algo salio mal al editar el dispositivo');
        }
        setDevice(device);
    };

    return (
        <>
           {(id && device) ? (
               <DeviceForm onEditDevice={handleEditDevice} initialValues={device} />
           ) : (
               <DeviceForm onNewDevice={handleNewDevice} />)}
        </>
    );
};

export default DeviceNewPage;