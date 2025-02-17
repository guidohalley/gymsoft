import { useState, useEffect } from "react";
import { apiGetBloquesByRutina } from "@/services/RutinasService";
import { getBloques } from "@/services/BloquesService";

export const useSelectBloques = (rutinaId?: number) => {
    const [bloquesDisponibles, setBloquesDisponibles] = useState<any[]>([]);
    const [selectedBloques, setSelectedBloques] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBloques = async () => {
            setLoading(true);
            try {
                console.log("📡 Cargando TODOS los bloques disponibles...");
                const responseTodos = await getBloques();
                const todosLosBloques = responseTodos.data?.data || [];
                
                // console.log("✅ Bloques disponibles:", todosLosBloques);

                let bloquesAsignados = [];
                if (rutinaId) {
                    // console.log(`📡 Cargando bloques asignados a la rutina ID: ${rutinaId}`);
                    const responseAsignados = await apiGetBloquesByRutina(rutinaId);
                    bloquesAsignados = responseAsignados.data?.data || [];
                    // console.log("✅ Bloques asignados a la rutina:", bloquesAsignados);
                }

                const bloquesFormateados = todosLosBloques.map((b) => ({
                    id: b.id,
                    descripcion: b.descripcion,
                    orden: 1,
                    series: "3x8x2",
                    descanso: "1s",
                }));

                const bloquesPreseleccionados = bloquesAsignados.map((b) => ({
                    id: b.bloque_id,
                    descripcion: b.descripcion,
                    orden: b.orden,
                    series: b.series,
                    descanso: b.descanso,
                }));

                setBloquesDisponibles(bloquesFormateados);
                setSelectedBloques(bloquesPreseleccionados);
            } catch (error) {
                console.error("  Error al obtener bloques:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBloques();
    }, [rutinaId]);

    return { bloquesDisponibles, selectedBloques, setSelectedBloques, loading };
};
