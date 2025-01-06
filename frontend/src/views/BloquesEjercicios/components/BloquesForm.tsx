import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Notification from '@/components/ui/Notification';
import toast from '@/components/ui/toast';
import { addBloque, updateBloque } from '@/services/BloquesService';

interface BloquesFormProps {
    initialValues?: {
        id?: number;
        descripcion: string;
        orden: number;
    };
    onSuccess?: () => void;
}

const BloquesForm: React.FC<BloquesFormProps> = ({ initialValues, onSuccess }) => {
    const formik = useFormik({
        initialValues: initialValues || {
            descripcion: '',
            orden: 1,
        },
        validationSchema: Yup.object({
            descripcion: Yup.string().required('La descripción es obligatoria'),
            orden: Yup.number().required('El orden es obligatorio').min(1, 'El orden debe ser al menos 1'),
        }),
        onSubmit: async (values) => {
            try {
                if (values.id) {
                    await updateBloque(values.id, values);
                    toast.push(
                        <Notification title="Bloque actualizado" type="success">
                            El bloque fue actualizado correctamente.
                        </Notification>
                    );
                } else {
                    await addBloque(values);
                    toast.push(
                        <Notification title="Bloque creado" type="success">
                            El bloque fue creado correctamente.
                        </Notification>
                    );
                }
                if (onSuccess) onSuccess();
            } catch (error) {
                console.error('Error al guardar el bloque:', error);
                toast.push(
                    <Notification title="Error" type="danger">
                        Ocurrió un problema al guardar el bloque.
                    </Notification>
                );
            }
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-4">
            <Input
                label="Descripción"
                name="descripcion"
                placeholder="Ingrese una descripción"
                value={formik.values.descripcion}
                onChange={formik.handleChange}
                error={formik.errors.descripcion}
            />
            <Input
                label="Orden"
                name="orden"
                type="number"
                placeholder="Ingrese el orden"
                value={formik.values.orden}
                onChange={formik.handleChange}
                error={formik.errors.orden}
            />
            <Button type="submit" variant="solid">
                {initialValues?.id ? 'Actualizar Bloque' : 'Crear Bloque'}
            </Button>
        </form>
    );
};

export default BloquesForm;
