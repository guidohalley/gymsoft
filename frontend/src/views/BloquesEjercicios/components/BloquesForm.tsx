import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { FormContainer, FormItem } from '@/components/ui/Form'
import Checkbox from '@/components/ui/Checkbox'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import {
  addBloque,
  updateBloque,
  getBloqueById,
  Bloque,
} from '@/services/BloquesService'
import {
  apiCreateBloqueEjercicios,
  apiGetEjerciciosByBloque,
} from '@/services/BloqueEjerciciosService'
import SelectEjercicios from './SelectEjercicios'
import { HiOutlineCheckCircle, HiOutlineExclamationCircle } from 'react-icons/hi'
import { Card } from '@/components/ui'

const validationSchema = Yup.object().shape({
  descripcion: Yup.string().required('La descripción es obligatoria'),
  activo: Yup.boolean().required(),
  ejercicios: Yup.array()
    .of(
      Yup.object().shape({
        ejercicioId: Yup.number().required(),
        repeticiones: Yup.string().required('Las repeticiones son obligatorias'),
        series: Yup.number()
          .min(1, 'Las series deben ser mayores a 0')
          .required(),
        descanso: Yup.number()
          .min(0, 'El descanso no puede ser negativo')
          .required(),
        peso: Yup.number().min(0, 'El peso no puede ser negativo').optional(),
      }),
    )
    .min(1, 'Debes seleccionar al menos un ejercicio'),
})

const BloquesForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()

  const isEditing = Boolean(id)
  const bloqueId = id ? Number(id) : undefined

  const [loadingData, setLoadingData] = useState(isEditing) // Cargamos datos solo si es edición
  const [loading, setLoading] = useState(false)
  const [initialValues, setInitialValues] = useState<Partial<Bloque>>({
    descripcion: '',
    activo: false,
    ejercicios: [],
  })

  // 1. Cargar el bloque (nombre, estado) y sus ejercicios (repeticiones, series, etc.)
  useEffect(() => {
    if (isEditing && bloqueId) {
      const fetchData = async () => {
        try {
          // Petición 1: Datos generales del bloque
          const respBloque = await getBloqueById(bloqueId)
          const bloqueInfo = respBloque.data.data

          // Petición 2: Ejercicios asociados al bloque
          const respEjercicios = await apiGetEjerciciosByBloque(bloqueId)
          const ejerciciosDelBloque = respEjercicios.data.data || []
          console.log('ejerciciosDelBloque:', ejerciciosDelBloque)
          // Mapeamos los datos de ejercicios para Formik
          const ejerciciosMapeados = ejerciciosDelBloque.map((ej) => ({
            ejercicioId: ej.ejercicioId,
            orden: ej.orden ?? 1,
            repeticiones: ej.repeticiones || '',
            series: ej.series || 1,
            descanso: ej.descanso || 0,
            peso: ej.peso || 0,
          }))

          // Unificamos la info en initialValues
          setInitialValues({
            descripcion: bloqueInfo.descripcion ?? '',
            activo: bloqueInfo.activo ?? false,
            ejercicios: ejerciciosMapeados,
          })
        } catch (error) {
          console.error('Error al cargar bloque y/o ejercicios:', error)
        } finally {
          setLoadingData(false)
        }
      }
      fetchData()
    } else {
      setLoadingData(false)
    }
  }, [isEditing, bloqueId])

  // 2. Manejo del submit
  const handleSubmit = async (values: Partial<Bloque>) => {
    setLoading(true)
    try {
      let bloqueResponse
      if (isEditing && bloqueId) {
        // Editar
        bloqueResponse = await updateBloque(bloqueId, values)
        toast.push(
          <Notification
            title="Actualización exitosa"
            type="success"
            customIcon={<HiOutlineCheckCircle className="text-2xl text-green-500" />}
          >
            El bloque ha sido actualizado correctamente.
          </Notification>,
        )
      } else {
        // Crear
        bloqueResponse = await addBloque(values)
        toast.push(
          <Notification
            title="Creación exitosa"
            type="success"
            customIcon={<HiOutlineCheckCircle className="text-2xl text-green-500" />}
          >
            Se ha creado un nuevo bloque.
          </Notification>,
        )
      }

      // Actualizar/crear la lista de ejercicios
      const ejerciciosFormateados = (values.ejercicios || []).map((ej) => ({
        ejercicioId: ej.ejercicioId,
        orden: ej.orden ?? 1,
        repeticiones: ej.repeticiones || '',
        series: ej.series || 1,
        descanso: ej.descanso || 30,
        peso: ej.peso || 0,
      }))

      if (bloqueResponse?.data?.data?.id && ejerciciosFormateados.length) {
        await apiCreateBloqueEjercicios(
          bloqueResponse.data.data.id,
          ejerciciosFormateados,
        )
      }

      navigate('/bloques')
    } catch (error) {
      toast.push(
        <Notification
          title="Error"
          type="danger"
          customIcon={<HiOutlineExclamationCircle className="text-2xl text-red-500" />}
        >
          {String(error)}
        </Notification>,
      )
      console.error('Error al guardar el bloque:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      {loadingData ? (
        <div className="text-center py-8">
          <span className="text-gray-500">Cargando datos...</span>
        </div>
      ) : (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, setFieldValue }) => (
            <Form>
              <FormContainer>
                <FormItem
                  label="Descripción"
                  asterisk
                  invalid={!!errors.descripcion && touched.descripcion}
                  errorMessage={errors.descripcion}
                >
                  <Field
                    name="descripcion"
                    component={Input}
                    placeholder="Ingrese la descripción del bloque"
                  />
                </FormItem>

                <FormItem>
                  <Checkbox
                    checked={Boolean(values.activo)}
                    onChange={(checked) => setFieldValue('activo', checked)}
                  >
                    Activo
                  </Checkbox>
                </FormItem>

                <FormItem
                  label="Ejercicios"
                  asterisk
                  invalid={!!errors.ejercicios && touched.ejercicios}
                  errorMessage={
                    typeof errors.ejercicios === 'string' ? errors.ejercicios : undefined
                  }
                >
                  <SelectEjercicios
                    selectedEjercicios={values.ejercicios || []}
                    onChange={(selectedEjercicios) =>
                      setFieldValue('ejercicios', selectedEjercicios)
                    }
                  />
                </FormItem>

                <FormItem>
                  <Button variant="solid" type="submit" loading={loading}>
                    {isEditing ? 'Actualizar Bloque' : 'Crear Bloque'}
                  </Button>
                  <Button variant="plain" type="button" onClick={() => navigate('/bloques')}>
                    Cancelar
                  </Button>
                </FormItem>
              </FormContainer>
            </Form>
          )}
        </Formik>
      )}
    </Card>
  )
}

export default BloquesForm
