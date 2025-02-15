import { useState, useEffect } from "react";
import { apiGetBloquesByRutina } from "@/services/RutinasService";

export const useSelectBloques = (rutinaId?: number) => {
    const [bloquesDisponibles, setBloquesDisponibles] = useState<any[]>([]);
    const [selectedBloques, setSelectedBloques] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!rutinaId) {
            setLoading(false);
            return;
        }
    
        const fetchRutinaBloques = async () => {
            setLoading(true);
            try {
                console.log(`📡 Solicitando bloques de la rutina ID: ${rutinaId}`);
    
                const response = await apiGetBloquesByRutina(rutinaId);
                console.log("✅ Bloques obtenidos:", response.data?.data);
    
                const bloquesRutina = response.data?.data || [];
    
                const bloquesAsignados = bloquesRutina.map(b => ({
                    id: b.bloque_id,
                    orden: b.orden,
                    series: b.series || "3x8x2",
                    descanso: b.descanso || "1s",
                }));
    
                // 🔥 Actualizar solo si los datos realmente cambiaron
                setSelectedBloques((prev) =>
                    JSON.stringify(prev) !== JSON.stringify(bloquesAsignados) ? bloquesAsignados : prev
                );
    
                setBloquesDisponibles(bloquesAsignados);
    
            } catch (error) {
                console.error("❌ Error al obtener bloques de la rutina:", error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchRutinaBloques();
    }, [rutinaId]);

    return { bloquesDisponibles, selectedBloques, setSelectedBloques, loading };
};
