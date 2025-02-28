import Button from '@/components/ui/Button'
import { HiOutlinePencil, HiTrash } from 'react-icons/hi';
import type { Musculo } from '@/@types/custom/musculos'

type Props = {
    musculo: Musculo
    onEliminarClick: (musculo: Musculo) => void
    onEditarClick: (musculo: Musculo) => void
}

const MusculoOpciones = ({ musculo, onEditarClick, onEliminarClick }: Props) => {
    return (
        <div className="flex items-center gap-2">
            <Button
                shape="circle"
                size="sm"
                variant="solid"
                onClick={() => onEditarClick(musculo)}
                icon={<HiOutlinePencil />}
                aria-label="Editar músculo"
            />
            <Button
                shape="circle"
                size="sm"
                variant="solid"
                onClick={() => onEliminarClick(musculo)}
                icon={<HiTrash />}
                aria-label="Eliminar músculo"
            />
        </div>
    );
};

export default MusculoOpciones;
