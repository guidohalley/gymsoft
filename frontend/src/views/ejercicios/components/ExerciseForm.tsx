import React, { useState } from 'react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { FormContainer, FormItem } from '@/components/ui/Form'
import Select from '@/components/ui/Select'
import Checkbox from '@/components/ui/Checkbox'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import ExerciseUpload from './ExerciseUpload'
import {
    HiOutlineCheckCircle,
    HiOutlineExclamationCircle,
} from 'react-icons/hi'

// Validación del formulario
const validationSchema = Yup.object().shape({
    nombre: Yup.string().required('El nombre es requerido'),
    descripcion: Yup.string().required('La descripción es requerida'),
    categoriaEjercicioId: Yup.string()
        .required('Debes seleccionar una categoría')
        .notOneOf([''], 'Selecciona un valor válido'),
    esGlobal: Yup.boolean(),
    video: Yup.array().max(1, 'Solo se permite un archivo'),
})

interface ExerciseFormProps {
    onSubmit: (values: FormData) => Promise<void>
    categorias: { value: string; label: string }[]
    initialValues: {
        nombre: string
        descripcion: string
        categoriaEjercicioId: string
        esGlobal: boolean
        video: File[]
        videoUrl?: string // Nueva propiedad para la URL del video
    }
    enableReinitialize?: boolean
}

const ExerciseForm: React.FC<ExerciseFormProps> = ({
    onSubmit,
    categorias,
    initialValues,
    enableReinitialize = false,
}) => {
    const [loading, setLoading] = useState(false)
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState(initialValues.videoUrl || '');

    return (
        <Formik
            initialValues={initialValues}
            enableReinitialize={enableReinitialize}
            validationSchema={validationSchema}
            onSubmit={async (values, { resetForm }) => {
                setLoading(true)
                try {
                    const formData = new FormData()
                    formData.append('nombre', values.nombre)
                    formData.append('descripcion', values.descripcion)
                    formData.append(
                        'categoriaEjercicioId',
                        values.categoriaEjercicioId,
                    )
                    formData.append(
                        'esGlobal',
                        values.esGlobal ? 'true' : 'false',
                    )   
                    
                    if (videoFile) {
                        formData.append("video", videoFile);
                    } else if (initialValues.videoUrl) {
                        formData.append("videoUrl", initialValues.videoUrl);
                    }

                    await onSubmit(formData)

                    toast.push(
                        <Notification
                            title="Éxito"
                            customIcon={
                                <HiOutlineCheckCircle className="text-2xl text-green-500" />
                            }
                        >
                            Ejercicio creado o actualizado exitosamente.
                        </Notification>,
                    )
                    resetForm()
                } catch (error) {
                    console.error('Error al guardar el ejercicio:', error)
                    toast.push(
                        <Notification
                            title="Error"
                            customIcon={
                                <HiOutlineExclamationCircle className="text-2xl text-red-500" />
                            }
                        >
                            {(error as any).response?.data?.message ||
                                'Ocurrió un problema desconocido.'}
                        </Notification>,
                    )
                } finally {
                    setLoading(false)
                }
            }}
        >
            {({ values, touched, errors, setFieldValue }) => (
                <Form>
                    <FormContainer>
                        <FormItem
                            label="Nombre del ejercicio"
                            asterisk
                            invalid={!!errors.nombre && touched.nombre}
                            errorMessage={errors.nombre}
                        >
                            <Field
                                name="nombre"
                                component={Input}
                                placeholder="Ingrese el nombre del ejercicio"
                            />
                        </FormItem>

                        <FormItem
                            label="Descripción"
                            asterisk
                            invalid={
                                !!errors.descripcion && touched.descripcion
                            }
                            errorMessage={errors.descripcion}
                        >
                            <Field
                                name="descripcion"
                                as="textarea"
                                className="border rounded w-full h-20 p-2"
                                placeholder="Descripción del ejercicio"
                            />
                        </FormItem>

                        <FormItem
                            label="Categoría"
                            asterisk
                            invalid={
                                !!errors.categoriaEjercicioId &&
                                touched.categoriaEjercicioId
                            }
                            errorMessage={errors.categoriaEjercicioId}
                        >
                            <Field name="categoriaEjercicioId">
                                {({ field, form }: any) => (
                                    <Select
                                        value={categorias.find(
                                            (option) =>
                                                option.value === field.value,
                                        )}
                                        placeholder="Seleccione una categoría..."
                                        options={categorias}
                                        onChange={(option) =>
                                            option &&
                                            form.setFieldValue(
                                                field.name,
                                                option.value,
                                            )
                                        }
                                    />
                                )}
                            </Field>
                        </FormItem>

                        <FormItem label="Es Global">
                            <Checkbox
                                checked={values.esGlobal}
                                onChange={(checked: boolean) =>
                                    setFieldValue('esGlobal', checked)
                                }
                            >
                                Marcar como global
                            </Checkbox>
                        </FormItem>

                        <FormItem label="Video">
                            {previewUrl ? (
                                <div className="mb-4">
                                    <video controls src={previewUrl} className="w-128 h-72 rounded-md" />
                                </div>
                            ) : (
                                <p className="text-gray-500 mb-4">No hay un video cargado.</p>
                            )}
                            <ExerciseUpload
                                value={videoFile}
                                onChange={(file) => {
                                    setVideoFile(file);
                                    setPreviewUrl(file ? URL.createObjectURL(file) : initialValues.videoUrl || '');
                                }}
                                maxFileSizeMB={5}
                            />
                        </FormItem>
                        <FormItem>
                            <Button
                                variant="solid"
                                type="submit"
                                loading={loading}
                            >
                                Guardar
                            </Button>
                            <Button variant="plain" type="reset">
                                Limpiar
                            </Button>
                        </FormItem>
                    </FormContainer>
                </Form>
            )}
        </Formik>
    )
}

export default ExerciseForm
