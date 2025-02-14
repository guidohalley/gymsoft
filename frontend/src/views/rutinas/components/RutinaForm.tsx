import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { FormContainer, FormItem } from "@/components/ui/Form";
import Checkbox from "@/components/ui/Checkbox";
import SelectBloques from "./SelectBloques";
import { useRutinaForm } from "@/hooks/useRutinaForm";
import Spinner from "@/components/ui/Spinner";

const validationSchema = Yup.object().shape({
    nombre: Yup.string().required("El nombre es obligatorio"),
    descripcion: Yup.string().required("La descripción es obligatoria"),
    estadoId: Yup.number().oneOf([1, 2], "Debe ser 1 o 2").required("El estado es obligatorio"),
});

const RutinaForm: React.FC<{ rutinaId?: number }> = ({ rutinaId }) => {
    const { handleSubmit, initialValues, loading } = useRutinaForm(rutinaId);

    if (loading) return <Spinner />; // 🔹 Esperamos a que los datos estén listos antes de renderizar

    return (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {({ values, setFieldValue }) => (
                <Form>
                    <FormContainer>
                        <FormItem label="Nombre" asterisk>
                            <Field name="nombre" component={Input} placeholder="Ingrese el nombre de la rutina" />
                        </FormItem>

                        <FormItem label="Descripción" asterisk>
                            <Field name="descripcion" component={Input} placeholder="Ingrese la descripción de la rutina" />
                        </FormItem>

                        <FormItem>
                            <Checkbox
                                checked={values.estadoId === 1}
                                onChange={(checked) => setFieldValue("estadoId", checked ? 1 : 2)}
                            >
                                Activo
                            </Checkbox>
                        </FormItem>

                        <FormItem label="Bloques" asterisk>
                        <SelectBloques
                            rutinaId={rutinaId}
                            selectedBloques={values.bloques} // 🔥 Precargamos los bloques aquí
                            onChange={(bloques) => setFieldValue("bloques", bloques)}
                        />
                        </FormItem>

                        <Button variant="solid" type="submit">
                            {rutinaId ? "Actualizar Rutina" : "Crear Rutina"}
                        </Button>
                    </FormContainer>
                </Form>
            )}
        </Formik>
    );
};

export default RutinaForm;
