import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
    apiCreateRutina, 
    apiUpdateRutina, 
    apiAddBloquesToRutina, 
    apiRemoveBloquesFromRutina, 
    apiGetRutinaDetails, 
    apiGetBloquesByRutina 
} from "@/services/RutinasService";
import toast from "@/components/ui/toast";
import Notification from "@/components/ui/Notification";

export const useRutinaForm = (rutinaId?: number) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [initialValues, setInitialValues] = useState({        
        nombre: "",
        descripcion: "",
        estadoId: 1,
        bloques: [],
    });
    const [bloquesOriginales, setBloquesOriginales] = useState<number[]>([]);

    useEffect(() => {
        if (!rutinaId) {
            setLoading(false);
            return;
        }

        const fetchRutina = async () => {
            setLoading(true);
            try {
                console.log(`📡 Cargando rutina ID: ${rutinaId}...`);

                const response = await apiGetRutinaDetails(rutinaId);
                if (!response.data?.data) {
                    console.warn("⚠️ No se encontró la rutina con ID:", rutinaId);
                    setLoading(false);
                    return;
                }

                const rutina = response.data.data;
                const bloquesResponse = await apiGetBloquesByRutina(rutinaId);
                console.log("✅ Bloques obtenidos:", bloquesResponse);

                const bloquesAsignados = bloquesResponse.data?.data.map((bloque) => ({
                    id: bloque.bloque_id,
                    orden: bloque.orden,
                    series: bloque.series || "3x8x2",
                    descanso: bloque.descanso || "1s",
                })) || [];

                setBloquesOriginales(bloquesAsignados.map((b) => b.id));

                setInitialValues({
                    id: rutina.id,
                    nombre: rutina.nombre || "",
                    descripcion: rutina.descripcion || "",
                    estadoId: rutina.estadoId ?? 1,
                    bloques: bloquesAsignados,
                });

            } catch (error) {
                console.error("❌ Error al cargar rutina:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRutina();
    }, [rutinaId]);

    // ✅ **Definiendo `handleSubmit` correctamente**
    const handleSubmit = async (values: any) => {
        try {
            let rutinaIdActual = rutinaId;

            if (!rutinaIdActual) {
                const rutinaResponse = await apiCreateRutina({
                    nombre: values.nombre,
                    descripcion: values.descripcion,
                    estadoId: values.estadoId ?? 1, 
                });

                rutinaIdActual = rutinaResponse.data.data.id;
                if (!rutinaIdActual) throw new Error("No se pudo obtener el ID de la rutina");
            } else {
                await apiUpdateRutina({
                    id: rutinaIdActual,
                    nombre: values.nombre,
                    descripcion: values.descripcion,
                    estadoId: values.estadoId ?? 1,
                });
            }

            const bloquesFormateados = values.bloques.map((bloque, index) => ({
                id: bloque.id,
                orden: index + 1,
                series: bloque.series || "3x8x2",
                descanso: bloque.descanso || "1s"
            }));

            if (bloquesOriginales.length > 0) {
                try {
                    console.log("📡 Eliminando bloques:", bloquesOriginales);

                    await apiRemoveBloquesFromRutina(rutinaIdActual, bloquesOriginales);

                    console.log("✅ Bloques eliminados correctamente.");

                    const updatedResponse = await apiGetBloquesByRutina(rutinaIdActual);
                    console.log("🔄 Nueva lista de bloques después del DELETE:", updatedResponse.data.data);

                    setInitialValues((prevValues) => ({
                        ...prevValues,
                        bloques: updatedResponse.data.data.map(b => ({
                            id: b.bloque_id,
                            orden: b.orden,
                            series: b.series || "3x8x2",
                            descanso: b.descanso || "1s"
                        }))
                    }));
                } catch (error) {
                    console.error("❌ Error al eliminar bloques:", error);
                }
            }

            if (bloquesFormateados.length > 0) {
                await apiAddBloquesToRutina(rutinaIdActual, bloquesFormateados);
            }

            toast.push(
                <Notification title="Éxito" type="success" duration={3000}>
                    ✅ Rutina guardada con éxito.
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
