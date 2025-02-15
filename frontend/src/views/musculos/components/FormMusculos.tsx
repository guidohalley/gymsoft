import { useState } from 'react'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { Card } from '@/components/ui'
import type { Musculo, NuevoMusculo } from '@/@types/custom/musculos'
import { apiCreateMusculo } from '@/services/MusculosService'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { ADMIN } from '@/constants/roles.constant'
import { useAppSelector } from '@/store'

const validationSchema = Yup.object().shape({
    nombre: Yup.string()
        .min(3, 'Muy corto!')
        .max(256, 'Muy largo!')
        .required('El nombre del musculo es requerido'),
    activo: Yup.bool(),
    esGlobal: Yup.bool(),
})

const openNotification = (
    title: string,
    type: 'success' | 'warning' | 'danger' | 'info',
    message: string,
) => {
    toast.push(
        <Notification title={title} type={type}>
            {message}
        </Notification>,
    )
}

interface Props {
    onEditarMusculo?: (musculo: NuevoMusculo) => void
    onNuevoMusculo?: () => void
    valoresIniciales?: Musculo | null
}

const FormMusculos = ({
    onNuevoMusculo,
    onEditarMusculo,
    valoresIniciales,
}: Props) => {
    const { authority } = useAppSelector((state) => state.auth.user)

    return (
        <Card>
            <Formik
                initialValues={{
                    nombre: valoresIniciales?.nombre || '',
                    activo: valoresIniciales?.activo || true,
                    esGlobal: valoresIniciales?.esGlobal || false,
                }}
                validationSchema={validationSchema}
                onSubmit={async (values, { resetForm, setSubmitting }) => {
                    try {
                        if (onEditarMusculo) {
                            onEditarMusculo(values)
                            openNotification(
                                'Exito!',
                                'success',
                                'Se edito el musculo correctamente',
                            )
                            resetForm()
                        } else if (onNuevoMusculo) {
                            const resp = await apiCreateMusculo(values)
                            openNotification(
                                'Exito!',
                                'success',
                                'Se creo el musculo correctamente',
                            )
                            onNuevoMusculo()
                            resetForm()
                        }
                    } catch (error: any) {
                        const mensaje = openNotification(
                            'Algo salio mal',
                            'danger',
                            error?.response?.data?.message,
                        )
                    }
                }}
            >
                {({ touched, errors, resetForm }) => (
                    <Form>
                        <FormContainer>
                            <FormItem
                                label="Musculo"
                                invalid={errors.nombre && touched.nombre}
                                errorMessage={errors.nombre}
                            >
                                <Field
                                    type="text"
                                    autoComplete="off"
                                    name="nombre"
                                    placeholder=""
                                    component={Input}
                                />
                            </FormItem>
                            <FormItem>
                                <Field name="activo" component={Checkbox}>
                                    Activo
                                </Field>
                            </FormItem>
                            {authority?.includes(ADMIN) ? (
                                <FormItem>
                                    <Field name="esGlobal" component={Checkbox}>
                                        Global
                                    </Field>
                                </FormItem>
                            ) : (
                                ''
                            )}

                            <FormItem>
                                <Button
                                    type="reset"
                                    className="ltr:mr-2 rtl:ml-2"
                                    onClick={() => resetForm()}
                                >
                                    Limpiar
                                </Button>
                                <Button variant="solid" type="submit">
                                    Guardar
                                </Button>
                            </FormItem>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </Card>
    )
}

export default FormMusculos
