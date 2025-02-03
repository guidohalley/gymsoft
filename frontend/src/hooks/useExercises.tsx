// src/hooks/useExercises.ts
import { useState, useEffect, createContext, useContext } from 'react';
import {
    apiGetEjercicios,
    apiCreateEjercicio,
    apiUpdateEjercicio,
    apiDeleteEjercicio,
} from '@/services/ExerciseService';
import toast from '@/components/ui/toast';
import Notification from '@/components/ui/Notification';
import { HiOutlineCheckCircle, HiOutlineExclamationCircle } from 'react-icons/hi';

const ExercisesContext = createContext<any>(null);

export const ExercisesProvider = ({ children }) => {
    const [exercises, setExercises] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchExercises();
    }, []);

    const fetchExercises = async () => {
        try {
            setLoading(true);
            const response = await apiGetEjercicios();
            setExercises(response.data.data);
            setError(null);
        } catch (error) {
            setError('No se pudieron cargar los ejercicios.');
            toast.push(
                <Notification title="Error" type="danger">
                    Ocurrió un problema al cargar los ejercicios.
                </Notification>
            );
        } finally {
            setLoading(false);
        }
    };

    const createExercise = async (data: FormData) => {
        try {
            const response = await apiCreateEjercicio(data);
            setExercises([...exercises, response.data.data]);
            toast.push(
                <Notification
                    title="Éxito"
                    customIcon={<HiOutlineCheckCircle className="text-green-500 text-xl" />}
                >
                    Ejercicio creado exitosamente.
                </Notification>
            );
        } catch (error) {
            toast.push(
                <Notification
                    title="Error"
                    customIcon={<HiOutlineExclamationCircle className="text-red-500 text-xl" />}
                >
                    No se pudo crear el ejercicio.
                </Notification>
            );
        }
    };

    const updateExercise = async (id: number, data: FormData) => {
        try {
            await apiUpdateEjercicio({ id, ...data });
            setExercises((prev) => prev.map((ex) => (ex.id === id ? { ...ex, ...data } : ex)));
            toast.push(
                <Notification
                    title="Éxito"
                    customIcon={<HiOutlineCheckCircle className="text-green-500 text-xl" />}
                >
                    Ejercicio actualizado exitosamente.
                </Notification>
            );
        } catch (error) {
            toast.push(
                <Notification
                    title="Error"
                    customIcon={<HiOutlineExclamationCircle className="text-red-500 text-xl" />}
                >
                    No se pudo actualizar el ejercicio.
                </Notification>
            );
        }
    };

    const deleteExercise = async (id: number) => {
        try {
            await apiDeleteEjercicio(id);
            setExercises((prev) => prev.filter((ex) => ex.id !== id));
            toast.push(
                <Notification
                    title="Éxito"
                    customIcon={<HiOutlineCheckCircle className="text-green-500 text-xl" />}
                >
                    Ejercicio eliminado exitosamente.
                </Notification>
            );
        } catch (error) {
            toast.push(
                <Notification
                    title="Error"
                    customIcon={<HiOutlineExclamationCircle className="text-red-500 text-xl" />}
                >
                    No se pudo eliminar el ejercicio.
                </Notification>
            );
        }
    };

    return (
        <ExercisesContext.Provider value={{ exercises, loading, error, fetchExercises, createExercise, updateExercise, deleteExercise }}>
            {children}
        </ExercisesContext.Provider>
    );
};

export const useExercises = () => useContext(ExercisesContext);
