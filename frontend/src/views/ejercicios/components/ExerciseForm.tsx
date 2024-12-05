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

const validationSchema = Yup.object().shape({
    nombre: Yup.string().required('El nombre es requerido'),
    descripcion: Yup.string().required('La descripción es requerida'),
    categoriaEjercicioId: Yup.string().required(
        'Debes seleccionar una categoría',
    ),
    esGlobal: Yup.boolean(),
    video: Yup.array()
        .min(1, 'Debes subir al menos un archivo')
        .max(1, 'Solo se permite un archivo'),
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
    }
}

const ExerciseForm: React.FC<ExerciseFormProps> = ({
    onSubmit,
    onUpdate,
    categorias,
    initialValues,
}) => {
    const [loading, setLoading] = useState(false)

    return (
        <Formik
            initialValues={{
                nombre: '',
                descripcion: '',
                categoriaEjercicioId: '',
                esGlobal: false,
                video: [], // Inicializamos como arreglo vacío
            }}
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
                    if (values.video.length > 0) {
                        formData.append('video', values.video[0])
                    }

                    await onSubmit(formData)

                    toast.push(
                        <Notification
                            title="Éxito"
                            customIcon={
                                <HiOutlineCheckCircle className="text-2xl text-green-500" />
                            }
                        >
                            Ejercicio creado exitosamente.
                        </Notification>,
                    )
                    resetForm()
                } catch (error) {
                    toast.push(
                        <Notification
                            title="Error"
                            customIcon={
                                <HiOutlineExclamationCircle className="text-2xl text-red-500" />
                            }
                        >
                            Ocurrió un problema al guardar el ejercicio.
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

                        <FormItem
                            label="Video"
                            invalid={!!errors.video && !!touched.video}
                            errorMessage={
                                Array.isArray(errors.video)
                                    ? errors.video[0]
                                    : (errors.video as string)
                            }
                        >
                            <ExerciseUpload
                                value={
                                    Array.isArray(values.video) &&
                                    values.video.length > 0
                                        ? values.video[0]
                                        : null
                                }
                                onChange={(file) =>
                                    setFieldValue('video', file ? [file] : [])
                                }
                                maxFileSizeMB={5}
                                renameFile={(originalName) =>
                                    `ejercicio-${values.nombre.replace(
                                        /\s+/g,
                                        '_',
                                    )}-${Date.now()}.${originalName
                                        .split('.')
                                        .pop()}`
                                }
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
