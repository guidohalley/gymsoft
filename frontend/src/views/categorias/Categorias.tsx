// src/views/categorias/Categorias.tsx
import React, { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import FormCategorias from './components/FormCategorias';
import FormCategoriasSkeleton from './components/FormCategoriasSkeleton';
import ListCategorias from './components/ListCategorias';
import ListCategoriasSkeleton from './components/ListCategoriasSkeleton';
import Modal from '@/components/ui/Modal/Modal';
import toast from '@/components/ui/toast';
import Notification from '@/components/ui/Notification';
import { HiOutlineCheckCircle, HiOutlineExclamationCircle, HiOutlineTrash } from 'react-icons/hi';
import { getCategoriasEjercicios, deleteCategoriaEjercicio, updateCategoriaEjercicio } from '@/services/CategoriaEjerciciosService';

interface Categoria {
    id: number;
    nombre: string;
    activo: boolean;
    esGlobal: boolean;
    creadoPor: number;
    gimnasioId: number | null;
    createdAt: string;
    updatedAt: string;
}

const Categorias: React.FC = () => {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [selectedCategoria, setSelectedCategoria] = useState<Partial<Categoria> | null>(null);

    const fetchCategorias = async () => {
        try {
            const response = await getCategoriasEjercicios();
            if (Array.isArray(response.data.data)) {
                setCategorias(response.data.data);
            }
        } catch (error) {
            console.error('Error al obtener las categorías:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategorias();
    }, []);

    const handleDelete = async (id: number) => {
        try {
            await deleteCategoriaEjercicio(id);
            setCategorias((prevCategorias) => prevCategorias.filter((categoria) => categoria.id !== id));
        } catch (error) {
            console.error('Error al eliminar la categoría:', error);
        }
    };

    const handleEditClick = (categoria: Categoria) => {
        setSelectedCategoria(categoria);
        setEditModalOpen(true);
    };

    const handleEditSave = async (updatedData: Partial<Categoria>) => {
        if (selectedCategoria && selectedCategoria.id) {
            try {
                await updateCategoriaEjercicio(selectedCategoria.id, updatedData);
                await fetchCategorias();
                setEditModalOpen(false);
                setSelectedCategoria(null);
                toast.push(
                    <Notification
                        title="Categoría actualizada"
                        customIcon={<HiOutlineCheckCircle className="text-2xl text-blue-500" />}
                    >
                        La categoría se ha actualizado exitosamente.
                    </Notification>
                );
            } catch (error) {
                console.error('Error al actualizar la categoría:', error);
            }
        }
    };

    return (
        <div className="p-4">
            <Card className="bg-white shadow-md p-6 rounded-lg">
                <h1 className="text-2xl font-bold mb-4">Categorías de ejercicios</h1>
                {isLoading ? (
                    <FormCategoriasSkeleton />
                ) : (
                    <FormCategorias onAddCategoria={fetchCategorias} />
                )}
            </Card>
            <Card className="bg-white shadow-md p-6 rounded-lg mt-4">
                {isLoading ? (
                    <ListCategoriasSkeleton />
                ) : (
                    <ListCategorias categorias={categorias} onDelete={handleDelete} onEdit={handleEditClick} />
                )}
            </Card>

            {isEditModalOpen && selectedCategoria && (
                <Modal onClose={() => setEditModalOpen(false)} title="Editar Categoría">
                    <FormCategorias
                        initialValues={selectedCategoria}
                        onSave={handleEditSave}
                        onCancel={() => setEditModalOpen(false)}
                    />
                </Modal>
            )}
        </div>
    );
};

export default Categorias;
