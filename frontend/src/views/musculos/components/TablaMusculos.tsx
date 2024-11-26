import React, { useState } from 'react'
import Table from '@/components/ui/Table'
import type { Musculo } from '@/@types/custom/musculos'
import { ADMIN } from '@/constants/roles.constant'
import { useAppSelector } from '@/store'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import MusculoOpciones from './OpcionesTablaMusculos';
import {formatDateTime} from '@/utils/dates'

const { Tr, Th, Td, THead, TBody } = Table

type Props = {
    musculos: Musculo[] | null
    onEliminarMusculo: (id: number) => void
    onEditClick: (musculo: Musculo) => void
}

const TablaMusculos = ({ musculos, onEliminarMusculo, onEditClick }: Props) => {
    const { authority } = useAppSelector((state) => state.auth.user)
    const [musculoSeleccionado, setMusculoSeleccionado] =
        useState<Musculo | null>(null)

    const handleEliminarMusculo = (musculo: Musculo) => {
        setMusculoSeleccionado(musculo)
    }

    const handleConfirmacionModal = () => {
        if (musculoSeleccionado) {
            onEliminarMusculo(musculoSeleccionado.id)
            setMusculoSeleccionado(null)
        }
    }

    const handleCerrarModal = () => {
        setMusculoSeleccionado(null)
    }

    const mostrarOpciones = (musculo: Musculo) => {
        if (musculo.esGlobal && !authority?.includes(ADMIN)) {
            return
        }

        return (
            <MusculoOpciones
            musculo={musculo}
            onEditarClick={onEditClick}
            onEliminarClick={handleEliminarMusculo}
        />
        )
    }

    return (
        <>
            <Table compact>
                <THead>
                    <Tr>
                        <Th>id</Th>
                        <Th>Musculo</Th>
                        <Th>Estado</Th>
                        <Th>Global</Th>
                        <Th>Fecha Creacion</Th>
                        <Th>Ultima Actualizacion</Th>
                        <Th>Opciones</Th>
                    </Tr>
                </THead>
                <TBody>
                    {musculos && musculos.length > 0 ? (
                        musculos.map((musculo) => (
                            <Tr key={musculo.id}>
                                <Td>{musculo.id}</Td>
                                <Td>{musculo.nombre}</Td>
                                <Td>
                                    {musculo.activo ? 'Activo' : 'Desactivado'}
                                </Td>
                                <Td>{musculo.esGlobal ? '🌎' : '🏡'}</Td>
                                <Td>{musculo.createdAt && formatDateTime(musculo.createdAt)}</Td>
                                <Td>{musculo.updatedAt && formatDateTime(musculo.updatedAt)}</Td>
                                <Td>{mostrarOpciones(musculo)}</Td>
                            </Tr>
                        ))
                    ) : (
                        <Tr>
                            <Td colSpan={5} className="text-center">
                                No hay músculos
                            </Td>
                        </Tr>
                    )}
                </TBody>
            </Table>
            <ConfirmDialog
                isOpen={musculoSeleccionado ? true : false}
                type="danger"
                confirmButtonColor="red"
                title="Eliminar musculo"
                onCancel={handleCerrarModal}
                onConfirm={handleConfirmacionModal}
                cancelText="Cancelar"
                confirmText="Eliminar"
            >
                <p>¿Estás seguro que deseas eliminar el musculo?</p>
            </ConfirmDialog>
        </>
    )
}

export default TablaMusculos
