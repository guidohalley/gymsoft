// frontend/src/views/BloquesEjercicios/BloquesListPage.tsx
import React, { useEffect, useState } from 'react'
import { getBloques, deleteBloque } from '@/services/BloquesService'
import BloquesTable from './components/BloquesTable'
import BloquesTableTools from './components/BloquesTableTools'
import Card from '@/components/ui/Card'
import Spinner from '@/components/ui/Spinner'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { useNavigate } from 'react-router-dom' // Usamos para redirección

const BloquesListPage: React.FC = () => {
    const [bloques, setBloques] = useState<any[]>([])
    const [filteredBloques, setFilteredBloques] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [deleting, setDeleting] = useState<number | null>(null) // ID del bloque en proceso de eliminación
    const [error, setError] = useState<string | null>(null)

    // React Router: para navegar a rutas de creación/edición
    const navigate = useNavigate()

    // 1. Maneja la edición: navega a la ruta /bloques/:id/editar
    const handleEdit = (bloqueId: number) => {
        navigate(`/bloques/${bloqueId}/editar`)
    }

    // 2. Maneja la eliminación (DELETE)
    const handleDelete = async (bloqueId: number) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar este bloque?')) {
            return
        }

        setDeleting(bloqueId)
        try {
            await deleteBloque(bloqueId) // Llama al servicio (DELETE /bloques/:id)
            // Actualiza la lista local
            setBloques((prev) => prev.filter((bloque) => bloque.id !== bloqueId))
            setFilteredBloques((prev) => prev.filter((bloque) => bloque.id !== bloqueId))

            toast.push(
                <Notification title="Eliminación exitosa" type="success" duration={3000}>
                    El bloque se ha eliminado correctamente.
                </Notification>,
            )
        } catch (error) {
            toast.push(
                <Notification title="Error" type="danger" duration={5000}>
                    No se pudo eliminar el bloque. Intenta de nuevo más tarde.
                </Notification>,
            )
        } finally {
            setDeleting(null)
        }
    }

    // 3. Carga inicial de bloques (GET /bloques)
    useEffect(() => {
        const fetchBloques = async () => {
            try {
                const response = await getBloques()
                if (Array.isArray(response.data.data)) {
                    setBloques(response.data.data)
                    setFilteredBloques(response.data.data)
                } else {
                    throw new Error('Formato de datos incorrecto')
                }
            } catch (error) {
                setError('No se pudieron cargar los bloques.')
                toast.push(
                    <Notification title="Error" type="danger">
                        Ocurrió un problema al cargar los bloques.
                    </Notification>,
                    { placement: 'top-center' },
                )
            } finally {
                setLoading(false)
            }
        }
        fetchBloques()
    }, [])

    // 4. Maneja la búsqueda filtrando bloques en memoria
    const handleSearch = (searchTerm: string) => {
        const lowercasedTerm = searchTerm.toLowerCase()
        const filtered = bloques.filter((bloque) =>
            Object.keys(bloque).some((key) => {
                const value = bloque[key]
                if (value && typeof value === 'string') {
                    return value.toLowerCase().includes(lowercasedTerm)
                }
                if (value && typeof value === 'number') {
                    return value.toString().toLowerCase().includes(lowercasedTerm)
                }
                return false
            }),
        )
        setFilteredBloques(filtered)
    }

    // 5. Maneja la creación: navega a /bloques/nuevo (ruta para formulario de creación)
    const handleCreate = () => {
        navigate('/bloques/nuevo')
    }

    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-bold">
                    Listado de Bloques de Ejercicios
                </h1>
                <BloquesTableTools
                    onSearch={handleSearch}
                    onCreate={handleCreate}
                />
            </div>

            {/* 6. Mostrar Spinner, error o la tabla según el estado */}
            {loading ? (
                <Spinner />
            ) : error ? (
                <Notification title="Error al cargar" type="danger">
                    {error}
                </Notification>
            ) : filteredBloques.length === 0 ? (
                <Card className="text-center py-8">
                    <h2 className="text-lg font-bold">
                        No hay bloques registrados
                    </h2>
                    <p className="text-gray-500">
                        Puedes agregar nuevos bloques desde el botón "Nuevo
                        Bloque".
                    </p>
                </Card>
            ) : (
                <BloquesTable
                    data={filteredBloques}
                    onEdit={handleEdit}     // Llama navigate('/bloques/:id/editar')
                    onDelete={handleDelete} // Llama a deleteBloque
                    deleting={deleting}     // Para mostrar spinner en el que se está eliminando
                />
            )}
        </Card>
    )
}

export default BloquesListPage
