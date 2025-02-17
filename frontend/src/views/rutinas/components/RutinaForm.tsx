import React, { useCallback } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { FormContainer, FormItem } from "@/components/ui/Form";
import Checkbox from "@/components/ui/Checkbox";
import SelectBloques from "./SelectBloques";
import { useRutinaForm } from "@/hooks/useRutinaForm";
import Spinner from "@/components/ui/Spinner";
import { useNavigate } from "react-router-dom";
import toast from "@/components/ui/toast";
import Notification from "@/components/ui/Notification";
import Card from "@/components/ui/Card";

const validationSchema = Yup.object().shape({
    nombre: Yup.string().required("El nombre es obligatorio"),
    descripcion: Yup.string().required("La descripción es obligatoria"),
    estadoId: Yup.number().oneOf([1, 2], "Debe ser 1 o 2").required("El estado es obligatorio"),
});

const RutinaForm: React.FC<{ rutinaId?: number }> = ({ rutinaId }) => {
    const { handleSubmit, initialValues, loading } = useRutinaForm(rutinaId);
    const navigate = useNavigate();

    if (loading) return <Spinner />;

    return (
        <Card className="p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-4">{rutinaId ? "Editar Rutina" : "Crear Rutina"}</h3>
            <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
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
                                    selectedBloques={values.bloques}
                                    onChange={(bloques) => {
                                        const nuevosBloques = bloques.map((b, index) => ({
                                            id: b.id,
                                            orden: index + 1,
                                            series: b.series || "3x8x2",
                                            descanso: b.descanso || "1s"
                                        }));

                                        //   Evita actualizaciones innecesarias
                                        if (JSON.stringify(nuevosBloques) !== JSON.stringify(values.bloques)) {
                                            setFieldValue("bloques", nuevosBloques);
                                        }
                                    }}
                                />
                            </FormItem>

                            <div className="flex justify-end mt-6">
                                <Button variant="solid" type="submit">
                                    {rutinaId ? "Actualizar Rutina" : "Crear Rutina"}
                                </Button>
                            </div>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </Card>
    );
};

export default RutinaForm;
