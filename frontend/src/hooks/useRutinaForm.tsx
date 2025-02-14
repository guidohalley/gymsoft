import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiCreateRutina, apiUpdateRutina, apiAddBloquesToRutina, apiRemoveBloquesFromRutina, apiGetRutinaDetails, apiGetBloquesByRutina } from "@/services/RutinasService";
import toast from "@/components/ui/toast";
import Notification from "@/components/ui/Notification";

export const useRutinaForm = (rutinaId?: number) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [initialValues, setInitialValues] = useState({
        nombre: "",
        descripcion: "",
        estadoId: 1, // 🔹 Aseguramos que `estadoId` nunca sea undefined
        bloques: [],
    });
    const [bloquesOriginales, setBloquesOriginales] = useState<number[]>([]);

    useEffect(() => {
        if (rutinaId) {
            const fetchRutina = async () => {
                setLoading(true);
                try {
                    const response = await apiGetRutinaDetails(rutinaId);
                    if (response.data?.data) {
                        setInitialValues({
                            nombre: response.data.data.nombre || "",
                            descripcion: response.data.data.descripcion || "",
                            estadoId: response.data.data.estadoId || 1, // 🔹 Si `estadoId` no existe, usamos 1 por defecto
                            bloques: [],
                        });

                        const bloquesResponse = await apiGetBloquesByRutina(rutinaId);
                        const bloquesAsignados = bloquesResponse.data.data.map((bloque) => ({
                            id: bloque.bloque_id,
                            orden: bloque.orden,
                            series: bloque.series || "3x8x2",
                            descanso: bloque.descanso || "1s",
                        }));

                        setBloquesOriginales(response.data.data.bloques?.map((b: any) => b.id) || []);
                        setInitialValues((prev) => ({
                            ...prev,
                            bloques: bloquesAsignados, // 🔥 Ahora los bloques están precargados
                        }));
                    }
                } catch (error) {
                    console.error("❌ Error al cargar la rutina:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchRutina();
        } else {
            setLoading(false);
        }
    }, [rutinaId]);

    const handleSubmit = async (values: any) => {
        try {
            let rutinaIdActual = rutinaId;
    
            // 🔹 Si no existe la rutina, la creamos
            if (!rutinaIdActual) {
                const rutinaResponse = await apiCreateRutina({
                    nombre: values.nombre,
                    descripcion: values.descripcion,
                    estadoId: values.estadoId,
                });
    
                rutinaIdActual = rutinaResponse.data.data.id;
                if (!rutinaIdActual) throw new Error("No se pudo obtener el ID de la rutina");
            } else {
                // 🔹 Si ya existe, la actualizamos
                await apiUpdateRutina({
                    id: rutinaIdActual,
                    nombre: values.nombre,
                    descripcion: values.descripcion,
                    estadoId: values.estadoId,
                });
            }
    
            // 🔹 Formateamos los bloques seleccionados
            const bloquesFormateados = values.bloques.map((bloque, index) => ({
                id: bloque.id,
                orden: index + 1, // Asignamos orden automático
                series: bloque.series || "3x8x2",
                descanso: bloque.descanso || "1s"
            }));
    
            // 🔥 **Eliminamos los bloques existentes ANTES de agregar los nuevos**
            if (bloquesOriginales.length > 0) {
                console.log("🗑 Eliminando bloques originales:", bloquesOriginales);
                await apiRemoveBloquesFromRutina(rutinaIdActual, bloquesOriginales.map(b => b.id));
            }
    
            // 🔥 **Agregamos los nuevos bloques SOLO si hay bloques seleccionados**
            if (bloquesFormateados.length > 0) {
                console.log("📡 Agregando bloques:", bloquesFormateados);
                await apiAddBloquesToRutina(rutinaIdActual, bloquesFormateados);
            }
    
            toast.push(
                <Notification title="Éxito" type="success" duration={3000}>
                    ✅ Rutina actualizada con éxito.
                </Notification>
            );
    
            navigate("/rutinas/listado");
        } catch (error) {
            console.error("❌ Error al actualizar rutina:", error);
            toast.push(
                <Notification title="Error" type="danger" duration={3000}>
                    ❌ Error al actualizar la rutina.
                </Notification>
            );
        }
    };
    

    return { handleSubmit, initialValues, loading };
};
