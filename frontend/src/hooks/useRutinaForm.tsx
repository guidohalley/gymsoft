import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
    apiCreateRutina, 
    apiUpdateRutina, 
    apiAddBloquesToRutina, 
    apiRemoveBloquesFromRutina, 
    apiGetRutinaDetails, 
    apiGetBloquesByRutina, 
    apiUpdateBloquesInRutina
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
                console.log("  Bloques obtenidos:", bloquesResponse);

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

    const handleSubmit = async (values) => {
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
    
            // 1️⃣ Formatear los bloques para la API
            const bloquesFormateados = values.bloques.map((bloque, index) => ({
                id: bloque.id,
                orden: index + 1,
                series: bloque.series || "3x8x2",
                descanso: bloque.descanso || "1s"
            }));
    
            console.log("📡 Enviando bloques actualizados:", JSON.stringify({ bloques: bloquesFormateados }, null, 2));
    
            await apiUpdateBloquesInRutina(rutinaIdActual, bloquesFormateados);
    
            toast.push(
                <Notification title="Éxito" type="success" duration={3000}>
                    Bloques de la rutina actualizados correctamente.
                </Notification>
            );
    
            const updatedRutina = await apiGetRutinaDetails(rutinaIdActual);
            setInitialValues({
                id: updatedRutina.data.data.id,
                nombre: updatedRutina.data.data.nombre || "",
                descripcion: updatedRutina.data.data.descripcion || "",
                estadoId: updatedRutina.data.data.estadoId ?? 1,
                bloques: updatedRutina.data.data.bloques || []
            });
    
            navigate("/rutinas/listado");
    
        } catch (error) {
            console.error(" Error al actualizar los bloques de la rutina:", error);
            toast.push(
                <Notification title="Error" type="danger" duration={3000}>
                     No se pudieron actualizar los bloques.
                </Notification>
            );
        }
    };

    return { handleSubmit, initialValues, loading };
};
