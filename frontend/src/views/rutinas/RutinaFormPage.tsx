import { useParams } from 'react-router-dom';
import RutinaForm from './components/RutinaForm';

const RutinaFormPage = () => {
    const { id } = useParams(); // 📌 Obtener ID desde la URL
    const rutinaId = id ? parseInt(id, 10) : undefined; // 📌 Convertir a número

    return <RutinaForm rutinaId={rutinaId} />;
};

export default RutinaFormPage;
