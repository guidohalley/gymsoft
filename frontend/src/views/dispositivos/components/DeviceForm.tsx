import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { Card } from '@/components/ui'
import type { Device,NewDevice} from '@/@types/custom/devices'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { useNavigate } from 'react-router-dom'

const validationSchema = Yup.object().shape({
    nombre: Yup.string()
        .min(3, 'Muy corto!')
        .max(256, 'Muy largo!')
        .required('El nombre del dispositivo requerido'),
    descripcion: Yup.string()
        .min(3, 'Muy corto!')
        .max(256, 'Muy largo!')
        .required('La descripcion del dispositivo requerido'),
    activo: Yup.bool()
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
    onEditDevice?: (dispositivo: NewDevice) => void
    onNewDevice?: (dispositivo: NewDevice) => void
    initialValues?: Device | null
}

const DeviceForm = ({onEditDevice,onNewDevice,initialValues}: Props) => {
    const navigate = useNavigate()
    return (
        <Card>
            {
                onEditDevice ? (
                    <h2 className="text-2xl font-semibold pb-4">Editar Dispositivo</h2>
                ) : (
                    <h2 className="text-2xl font-semibold pb-4">Nuevo Dispositivo</h2>
                )
            }
            <Formik
                enableReinitialize={true}
                initialValues={{
                    nombre: initialValues?.nombre || '',
                    descripcion: initialValues?.descripcion || '',
                    activo: initialValues?.activo? true : false,
                }}
                validationSchema={validationSchema}
                onSubmit={async (values, { resetForm, setSubmitting }) => {
                    try {
                        setSubmitting(true);
                        let operacion = onEditDevice ? 'edito' : 'creo';
                        if (onEditDevice) {
                            onEditDevice(values)
                        } else if (onNewDevice) {                          
                            onNewDevice(values);                            
                        }

                        openNotification(
                            'Exito!',
                            'success',
                            `Se ${operacion} el dispositivo correctamente`,
                        )
                        resetForm();
                        navigate('/dispositivos', { replace: true });
                    } catch (error: any) {
                        openNotification(
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
                                label="Nombre"
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
                            <FormItem
                                label="Descripcion"
                                invalid={errors.descripcion && touched.descripcion}
                                errorMessage={errors.descripcion}
                            >
                                <Field
                                    type="text"
                                    autoComplete="off"
                                    name="descripcion"
                                    placeholder=""
                                    component={Input}
                                />
                            </FormItem>
                            <FormItem>
                                <Field name="activo" component={Checkbox} value={false}>
                                    Activo
                                </Field>
                            </FormItem>
                            <FormItem>
                                <Button
                                    type="reset"
                                    className="ltr:mr-2 rtl:ml-2"
                                    onClick={() => navigate('/dispositivos')}
                                >
                                    Volver
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

export default DeviceForm;
