import { useState, useMemo } from "react";
import Table from "@/components/ui/Table";
import Checkbox from "@/components/ui/Checkbox";
import Tag from "@/components/ui/Tag";
import Spinner from "@/components/ui/Spinner";
import Dialog from "@/components/ui/Dialog";
import Pagination from "@/components/ui/Pagination";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import { useSelectBloques } from "@/hooks/useSelectBloques";
import { apiGetEjerciciosByBloque } from "@/services/BloqueEjerciciosService";

const { Tr, Th, Td, THead, TBody } = Table;

// 📌 Definir interfaces para TypeScript
interface Bloque {
    id: number;
    descripcion: string;
    orden: number;
    series: string;
    descanso: string;
}

interface Ejercicio {
    ejercicio: {
        id: number;
        nombre: string;
        url: string;
    };
    series: string;
    repeticiones: number;
}

interface SelectBloquesProps {
    rutinaId?: number;
    selectedBloques: Bloque[];
    onChange: (bloques: Bloque[]) => void;
}

const SelectBloques: React.FC<SelectBloquesProps> = ({ rutinaId, selectedBloques, onChange }) => {
    const { bloquesDisponibles, selectedBloques: preseleccionados, setSelectedBloques, loading } = useSelectBloques(rutinaId);
    const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false);
    const [ejercicios, setEjercicios] = useState<Ejercicio[]>([]);
    const [bloqueSeleccionado, setBloqueSeleccionado] = useState<Bloque | null>(null);
    const [globalFilter, setGlobalFilter] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const pageSize: number = 5; // 📌 Número de bloques por página

    // 📌 Filtrar bloques según búsqueda
    const filteredBloques = useMemo(() => {
        return bloquesDisponibles.filter(bloque =>
            bloque.descripcion.toLowerCase().includes(globalFilter.toLowerCase())
        );
    }, [bloquesDisponibles, globalFilter]);

    // 📌 Calcular el total de páginas correctamente
    const totalPages: number = Math.max(1, Math.ceil(filteredBloques.length / pageSize));

    // 📌 Obtener los bloques de la página actual
    const paginatedBloques = useMemo(() => {
        const start = (page - 1) * pageSize;
        return filteredBloques.slice(start, start + pageSize);
    }, [filteredBloques, page]);

    // 📌 Manejar selección de bloques
    const handleCheckboxChange = (checked: boolean, bloque: Bloque) => {
        const updated = checked
            ? [...selectedBloques, bloque]
            : selectedBloques.filter((b) => b.id !== bloque.id);

        setSelectedBloques(updated);
        onChange(updated);
    };

    // 📌 Manejar vista de ejercicios
    const handleVerEjercicios = async (bloque: Bloque) => {
        if (!bloque || !bloque.id) {
            console.warn("⚠️ No se puede obtener ejercicios: bloque inválido", bloque);
            return;
        }
    
        try {
            console.log(`📡 Obteniendo ejercicios para bloque ID: ${bloque.id}`);
            const response = await apiGetEjerciciosByBloque(bloque.id);
            console.log("✅ Ejercicios obtenidos:", response.data?.data);
    
            const ejerciciosTransformados: Ejercicio[] = response.data?.data.map((e: any) => ({
                ejercicio: {
                    id: e.ejercicio.id,
                    nombre: e.ejercicio.nombre,
                    url: e.ejercicio.url,
                },
                series: e.series || "3x8x2",
                repeticiones: e.repeticiones || 10,
            })) || [];
    
            setEjercicios(ejerciciosTransformados);
            setBloqueSeleccionado(bloque);
            setDialogIsOpen(true);
        } catch (error) {
            console.error("❌ Error al obtener ejercicios:", error);
        }
    };
    

    return (
        <div>
            <h3 className="text-lg font-bold mb-4">Seleccionar Bloques</h3>

            {/* 📌 Filtro de búsqueda */}
            <div className="flex justify-end">
                <div className="flex items-center mb-4">
                    <span className="mr-2">Buscar: </span>
                    <Input
                        placeholder="🔎 Hit, Crossfit, etc..."
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <Spinner />
            ) : paginatedBloques.length === 0 ? (
                <p className="text-gray-500 text-center p-4">❌ No hay bloques disponibles</p>
            ) : (
                <>
                    <Table>
                        <THead>
                            <Tr>
                                <Th>Seleccionar</Th>
                                <Th>Orden</Th>
                                <Th>Nombre</Th>
                                <Th>Ver Ejercicios</Th>
                            </Tr>
                        </THead>
                        <TBody>
                            {paginatedBloques.map((bloque, index) => (
                                <Tr key={bloque.id}>
                                    <Td>
                                        <Checkbox
                                            checked={selectedBloques.some((b) => b.id === bloque.id)}
                                            onChange={(checked) => handleCheckboxChange(checked, bloque)}
                                        />
                                    </Td>
                                    <Td>{index + 1 + (page - 1) * pageSize}</Td>
                                    <Td>{bloque.descripcion}</Td>
                                    <Td>
                                    <Tag
                                        as="button" // ✅ Especificamos que el Tag actuará como un botón
                                        className="bg-blue-500 text-white border-0 cursor-pointer"
                                        onClick={() => handleVerEjercicios(bloque)}
                                    >
                                            Ver Ejercicios
                                    </Tag>
                                    </Td>
                                </Tr>
                            ))}
                        </TBody>
                    </Table>

                    {/* 📌 Paginación Corregida */}
                    {totalPages > 1 && (
                        <Pagination
                            currentPage={page}
                            pageCount={totalPages} // ✅ Cambio de totalPages a pageCount
                            onChange={(newPage: number) => {
                                if (newPage > totalPages || newPage < 1) return;
                                setPage(newPage);
                            }}
                        />
                    )}
                </>
            )}

            {/* ✅ Dialog para Ver Ejercicios */}
            <Dialog
                isOpen={dialogIsOpen}
                style={{ content: { marginTop: 100, width: "80%" } }}
                contentClassName="pb-0 px-0"
                onClose={() => setDialogIsOpen(false)}
                onRequestClose={() => setDialogIsOpen(false)}
            >
                <div className="px-6 pb-6">
                    <h5 className="mb-4 font-bold">Ejercicios del Bloque</h5>
                    {ejercicios.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4">
                            {ejercicios.map((ejercicio) => (
                                <Card
                                    key={ejercicio.ejercicio.id}
                                    className="hover:shadow-lg transition duration-150 ease-in-out border"
                                >
                                    <div className="rounded-t-lg overflow-hidden">
                                        <video
                                            controls
                                            src={ejercicio.ejercicio.url}
                                            className="w-full h-40 object-cover"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h6 className="font-semibold">
                                            {ejercicio.ejercicio.nombre}
                                        </h6>
                                        <p className="text-xs text-gray-600">
                                            <strong>Series:</strong> {ejercicio.series} |{" "}
                                            <strong>Reps:</strong> {ejercicio.repeticiones}
                                        </p>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500">
                            ❌ No hay ejercicios en este bloque.
                        </p>
                    )}
                </div>
                <div className="text-right px-6 py-3 bg-gray-100 dark:bg-gray-700 rounded-bl-lg rounded-br-lg">
                    <button
                        className="px-4 py-2 bg-gray-500 text-white rounded-md"
                        onClick={() => setDialogIsOpen(false)}
                    >
                        Cerrar
                    </button>
                </div>
            </Dialog>
        </div>
    );
};

export default SelectBloques;
