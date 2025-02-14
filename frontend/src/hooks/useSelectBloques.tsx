import { useState, useEffect } from "react";
import { getBloques } from "@/services/BloquesService";
import { apiGetBloquesByRutina } from "@/services/RutinasService";

export const useSelectBloques = (rutinaId?: number) => {
    const [bloquesDisponibles, setBloquesDisponibles] = useState<any[]>([]);
    const [selectedBloques, setSelectedBloques] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBloques = async () => {
            try {
                const response = await getBloques();
                setBloquesDisponibles(response.data.data);
            } catch (error) {
                console.error("❌ Error al cargar los bloques:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBloques();
    }, []);

    useEffect(() => {
        if (rutinaId) {
            const fetchRutinaBloques = async () => {
                try {
                    const response = await apiGetBloquesByRutina(rutinaId);
                    setSelectedBloques(response.data.data || []);
                } catch (error) {
                    console.error("❌ Error al obtener bloques de la rutina:", error);
                }
            };
            fetchRutinaBloques();
        }
    }, [rutinaId]);

    return { bloquesDisponibles, selectedBloques, setSelectedBloques, loading };
};
