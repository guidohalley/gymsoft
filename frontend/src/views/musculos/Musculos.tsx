import React, { useEffect, useState } from 'react'
import {
    apiGetMusculos,
    apiDeleteMusculo,
    apiEditarMusculo,
} from '@/services/MusculosService'
import TablaMusculos from './components/TablaMusculos'
import FormMusculos from './components/FormMusculos'
import type { Musculo, NuevoMusculo ,MusculoFiltro} from '@/@types/custom/musculos'
import Modal from '@/components/ui/Modal/Modal'
import InputBusqueda from './components/InputBusqueda' 
import AdaptableCard from '@/components/shared/AdaptableCard';

const ListadoMusculos = () => {
    const [musculos, setMusculos] = useState<Musculo[]>([])
    const [isEditModalOpen, setEditModalOpen] = useState(false)
    const [musculoSeleccionado, setMusculoSeleccionado] =
        useState<Musculo | null>({} as Musculo)
    const [filtro, setFiltro] = useState<MusculoFiltro>({ activo: true });

    useEffect(() => {
        fetchMusculos()
    }, [filtro])

    const fetchMusculos = async () => {
        try {
            const response = await apiGetMusculos(filtro)
            if (response.status === 200) {
                setMusculos(response.data.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleEliminarMusculo = async (id: number) => {
        try {
            const response = await apiDeleteMusculo(id)

            if (response.status === 200) {
                fetchMusculos()
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleNuevoMusculo = async () => {
        fetchMusculos()
    }

    const handleEditClick = (musculo: Musculo) => {
        setEditModalOpen(true)
        setMusculoSeleccionado(musculo)
    }

    const handleFilter = (value: string) => {
        if(value.length > 0){
            setFiltro((prev) => ({ ...prev, nombre: value }));
        }else{
            setFiltro({ activo: true }  );
        }
    }

    const handleEditarMusculo = async (musculoEditado: NuevoMusculo) => {
        try {
            if (musculoSeleccionado?.id) {
                const response = await apiEditarMusculo(
                    musculoSeleccionado.id,
                    musculoEditado,
                )

                if (response.status === 200) {
                    setMusculos((prev) =>
                        prev.map((musculo) =>
                            musculo.id === musculoSeleccionado?.id
                                ? { ...musculo, ...musculoEditado }
                                : musculo,
                        ),
                    )
                    setMusculoSeleccionado(null)
                    setEditModalOpen(false)
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <h1>Lista de musculos</h1>
            <div>
                <FormMusculos onNuevoMusculo={handleNuevoMusculo} />
            </div>
            <div className="mt-4">
                <AdaptableCard className="h-full" bodyClass="h-full">
                    <div className="lg:flex items-center justify-between mb-4">
                        <h3 className="mb-4 lg:mb-0">Musculos</h3>
                        <InputBusqueda onInputChange={handleFilter} />
                    </div>

                    <TablaMusculos
                        musculos={musculos}
                        onEliminarMusculo={handleEliminarMusculo}
                        onEditClick={handleEditClick}
                    />
                </AdaptableCard>
            </div>
            {isEditModalOpen && (
                <Modal
                    title="Editar musculo"
                    onClose={() => setEditModalOpen(false)}
                >
                    <FormMusculos
                        onEditarMusculo={handleEditarMusculo}
                        valoresIniciales={musculoSeleccionado}
                    />
                </Modal>
            )}
        </>
    )
}

export default ListadoMusculos
