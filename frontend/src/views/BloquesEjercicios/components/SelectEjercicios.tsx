import React, { useEffect, useState } from 'react'
import Table from '@/components/ui/Table'
import Input from '@/components/ui/Input'
import Checkbox from '@/components/ui/Checkbox'
import { apiGetEjercicios } from '@/services/ExerciseService'

const { Tr, Th, Td, THead, TBody } = Table

interface Ejercicio {
    id: number
    nombre: string
    descripcion: string
}

interface BloqueEjercicio {
    ejercicioId: number
    repeticiones: string
    series: number
    descanso: number
    peso?: number
}

// Quitamos bloqueId si no lo necesitas para nada en particular
// (A menos que uses bloqueId para otra lógica en este componente)
interface SelectEjerciciosProps {
    // bloqueId?: number  // Ya no es indispensable
    selectedEjercicios: BloqueEjercicio[]
    onChange: (selectedEjercicios: BloqueEjercicio[]) => void
}

const SelectEjercicios: React.FC<SelectEjerciciosProps> = ({
    // bloqueId,
    selectedEjercicios,
    onChange,
}) => {
    const [ejercicios, setEjercicios] = useState<Ejercicio[]>([])

    useEffect(() => {
        const fetchEjercicios = async () => {
            try {
                const responseEjercicios = await apiGetEjercicios()
                const todosLosEjercicios = responseEjercicios.data.data || []
                setEjercicios(todosLosEjercicios)
            } catch (error) {
                console.error('Error al cargar los ejercicios:', error)
            }
        }
        fetchEjercicios()
    }, [])

    const handleSelectEjercicio = (
        ejercicio: Ejercicio,
        isSelected: boolean,
    ) => {
        // Si está "desmarcando" (quitar), pides confirmación
        if (!isSelected) {
            if (!window.confirm('¿Estás seguro de eliminar este ejercicio?')) {
                return
            }
        }

        const updatedEjercicios = isSelected
            ? [
                  ...selectedEjercicios,
                  {
                      ejercicioId: ejercicio.id,
                      repeticiones: '',
                      series: 1,
                      descanso: 0,
                      peso: 0,
                  },
              ]
            : selectedEjercicios.filter((e) => e.ejercicioId !== ejercicio.id)

        onChange(updatedEjercicios)
    }

    return (
        <div className="bg-white p-4 rounded shadow mt-4">
            <h3 className="text-lg font-bold mb-4">Seleccionar Ejercicios</h3>
            <Table>
                <THead>
                    <Tr>
                        <Th>Seleccionar</Th>
                        <Th>Nombre</Th>
                        <Th>Descripción</Th>
                        <Th>Repeticiones</Th>
                        <Th>Series</Th>
                        <Th>Descanso(seg)</Th>
                        <Th>Peso(kg)</Th>
                    </Tr>
                </THead>
                <TBody>
                    {Array.isArray(ejercicios) && ejercicios.length > 0 ? (
                        ejercicios.map((ejercicio) => {
                            const isSelected = Array.isArray(selectedEjercicios)
                                ? selectedEjercicios.some(
                                      (e) => e.ejercicioId === ejercicio.id,
                                  )
                                : false

                            return (
                                <Tr key={ejercicio.id}>
                                    <Td>
                                        <Checkbox
                                            checked={isSelected}
                                            onChange={(checked) =>
                                                handleSelectEjercicio(
                                                    ejercicio,
                                                    checked,
                                                )
                                            }
                                        />
                                    </Td>
                                    <Td>{ejercicio.nombre}</Td>
                                    <Td>{ejercicio.descripcion}</Td>

                                    {/* Si está seleccionado, mostramos los inputs de configuración */}
                                    {isSelected && (
                                        <>
                                            <Td>
                                                <Input
                                                    value={
                                                        selectedEjercicios?.find(
                                                            (e) =>
                                                                e.ejercicioId ===
                                                                ejercicio.id,
                                                        )?.repeticiones || ''
                                                    }
                                                    onChange={(e) =>
                                                        onChange(
                                                            selectedEjercicios?.map(
                                                                (ej) =>
                                                                    ej.ejercicioId ===
                                                                    ejercicio.id
                                                                        ? {
                                                                              ...ej,
                                                                              repeticiones:
                                                                                  e
                                                                                      .target
                                                                                      .value,
                                                                          }
                                                                        : ej,
                                                            ) || [],
                                                        )
                                                    }
                                                />
                                            </Td>
                                            <Td>
                                                <Input
                                                    type="number"
                                                    value={
                                                        selectedEjercicios?.find(
                                                            (e) =>
                                                                e.ejercicioId ===
                                                                ejercicio.id,
                                                        )?.series || 1
                                                    }
                                                    onChange={(e) =>
                                                        onChange(
                                                            selectedEjercicios?.map(
                                                                (ej) =>
                                                                    ej.ejercicioId ===
                                                                    ejercicio.id
                                                                        ? {
                                                                              ...ej,
                                                                              series: Number(
                                                                                  e
                                                                                      .target
                                                                                      .value,
                                                                              ),
                                                                          }
                                                                        : ej,
                                                            ) || [],
                                                        )
                                                    }
                                                />
                                            </Td>
                                            <Td>
                                                <Input
                                                    type="number"
                                                    value={
                                                        selectedEjercicios?.find(
                                                            (e) =>
                                                                e.ejercicioId ===
                                                                ejercicio.id,
                                                        )?.descanso || 0
                                                    }
                                                    onChange={(e) =>
                                                        onChange(
                                                            selectedEjercicios?.map(
                                                                (ej) =>
                                                                    ej.ejercicioId ===
                                                                    ejercicio.id
                                                                        ? {
                                                                              ...ej,
                                                                              descanso:
                                                                                  Number(
                                                                                      e
                                                                                          .target
                                                                                          .value,
                                                                                  ),
                                                                          }
                                                                        : ej,
                                                            ) || [],
                                                        )
                                                    }
                                                />
                                            </Td>
                                            <Td>
                                                <Input
                                                    type="number"
                                                    value={
                                                        selectedEjercicios?.find(
                                                            (e) =>
                                                                e.ejercicioId ===
                                                                ejercicio.id,
                                                        )?.peso || 0
                                                    }
                                                    onChange={(e) =>
                                                        onChange(
                                                            selectedEjercicios?.map(
                                                                (ej) =>
                                                                    ej.ejercicioId ===
                                                                    ejercicio.id
                                                                        ? {
                                                                              ...ej,
                                                                              peso: Number(
                                                                                  e
                                                                                      .target
                                                                                      .value,
                                                                              ),
                                                                          }
                                                                        : ej,
                                                            ) || [],
                                                        )
                                                    }
                                                />
                                            </Td>
                                        </>
                                    )}
                                </Tr>
                            )
                        })
                    ) : (
                        <Tr>
                            <Td
                                colSpan={7}
                                className="text-center text-gray-500"
                            >
                                No hay ejercicios disponibles.
                            </Td>
                        </Tr>
                    )}
                </TBody>
            </Table>
        </div>
    )
}

export default SelectEjercicios
