//frontend/src/views/BloquesEjercicios/components/SelectEjercicios.tsx
import React, { useEffect, useState } from 'react'
import Table from '@/components/ui/Table'
import Input from '@/components/ui/Input'
import Checkbox from '@/components/ui/Checkbox'
import { apiGetEjercicios } from '@/services/ExerciseService'
import { apiGetEjerciciosByBloque } from '@/services/BloqueEjerciciosService'

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
    ejercicio: Ejercicio
}

interface SelectEjerciciosProps {
    bloqueId?: number // ✅ Recibe bloqueId como prop opcional
    selectedEjercicios: BloqueEjercicio[]
    onChange: (selectedEjercicios: BloqueEjercicio[]) => void
}

const SelectEjercicios: React.FC<SelectEjerciciosProps> = ({
    bloqueId,
    selectedEjercicios,
    onChange,
}) => {
    const [ejercicios, setEjercicios] = useState<Ejercicio[]>([])

    useEffect(() => {
        const fetchEjercicios = async () => {
            try {
                const responseEjercicios = await apiGetEjercicios()
                const todosLosEjercicios = responseEjercicios.data.data || []
                console.log(
                    'Todos los ejercicios cargados desde la API:',
                    todosLosEjercicios,
                )

                if (bloqueId) {
                    const responseEjerciciosBloque =
                        await apiGetEjerciciosByBloque(bloqueId)
                    const ejerciciosDelBloque =
                        responseEjerciciosBloque.data || []
                    console.log(
                        'Ejercicios asociados al bloque desde la API:',
                        ejerciciosDelBloque,
                    )

                    const ejerciciosSeleccionados = ejerciciosDelBloque.map(
                        (ej) => ({
                            ejercicioId: ej.ejercicioId,
                            repeticiones: ej.repeticiones,
                            series: ej.series,
                            descanso: ej.descanso,
                            peso: ej.peso,
                        }),
                    )

                    console.log(
                        'Ejercicios seleccionados después de mapear:',
                        ejerciciosSeleccionados,
                    )
                    onChange(ejerciciosSeleccionados)
                }

                setEjercicios(todosLosEjercicios)
            } catch (error) {
                console.error('Error al cargar los ejercicios:', error)
            }
        }

        fetchEjercicios()
    }, [bloqueId, onChange])

    const handleSelectEjercicio = (
        ejercicio: Ejercicio,
        isSelected: boolean,
    ) => {
        console.log('Ejercicio seleccionado:', ejercicio)
        console.log('Estado de selección:', isSelected)

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

        console.log(
            'Ejercicios actualizados después de seleccionar:',
            updatedEjercicios,
        )
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
                    {Array.isArray(ejercicios) &&
                        ejercicios.map((ejercicio) => {
                            const isSelected = selectedEjercicios.some(
                                (e) => e.ejercicioId === ejercicio.id,
                            )
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
                                    {isSelected && (
                                        <>
                                            <Td>
                                                <Input
                                                    value={
                                                        selectedEjercicios.find(
                                                            (e) =>
                                                                e.ejercicioId ===
                                                                ejercicio.id,
                                                        )?.repeticiones || ''
                                                    }
                                                    onChange={(e) =>
                                                        onChange(
                                                            selectedEjercicios.map(
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
                                                            ),
                                                        )
                                                    }
                                                />
                                            </Td>
                                            <Td>
                                                <Input
                                                    type="number"
                                                    value={
                                                        selectedEjercicios.find(
                                                            (e) =>
                                                                e.ejercicioId ===
                                                                ejercicio.id,
                                                        )?.series || 1
                                                    }
                                                    onChange={(e) =>
                                                        onChange(
                                                            selectedEjercicios.map(
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
                                                            ),
                                                        )
                                                    }
                                                />
                                            </Td>
                                            <Td>
                                                <Input
                                                    type="number"
                                                    value={
                                                        selectedEjercicios.find(
                                                            (e) =>
                                                                e.ejercicioId ===
                                                                ejercicio.id,
                                                        )?.descanso || 0
                                                    }
                                                    onChange={(e) =>
                                                        onChange(
                                                            selectedEjercicios.map(
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
                                                            ),
                                                        )
                                                    }
                                                />
                                            </Td>
                                            <Td>
                                                <Input
                                                    type="number"
                                                    value={
                                                        selectedEjercicios.find(
                                                            (e) =>
                                                                e.ejercicioId ===
                                                                ejercicio.id,
                                                        )?.peso || 0
                                                    }
                                                    onChange={(e) =>
                                                        onChange(
                                                            selectedEjercicios.map(
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
                                                            ),
                                                        )
                                                    }
                                                />
                                            </Td>
                                        </>
                                    )}
                                </Tr>
                            )
                        })}
                </TBody>
            </Table>
        </div>
    )
}

export default SelectEjercicios
