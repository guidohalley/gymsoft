import { useRef, useEffect, useMemo, useState } from "react";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";
import Table from "@/components/ui/Table";
import Checkbox from "@/components/ui/Checkbox";
import Tag from "@/components/ui/Tag";
import Spinner from "@/components/ui/Spinner";
import Dialog from "@/components/ui/Dialog";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useSelectBloques } from "@/hooks/useSelectBloques";
import { apiGetEjerciciosByBloque } from "@/services/BloqueEjerciciosService";
import { apiGetBloquesByRutina } from "@/services/RutinasService";

const { Tr, Th, Td, THead, TBody } = Table;

const SelectBloques = ({ rutinaId, selectedBloques, onChange }) => {
    const { bloquesDisponibles, loading } = useSelectBloques(rutinaId);
    const [rowSelection, setRowSelection] = useState({});
    const [dialogIsOpen, setDialogIsOpen] = useState(false);
    const [ejercicios, setEjercicios] = useState([]);
    const [bloqueSeleccionado, setBloqueSeleccionado] = useState(null);

    const bloquesMarcados = useMemo(
        () =>
            bloquesDisponibles.map((bloque) => ({
                ...bloque,
                seleccionado: selectedBloques.some((b) => b.id === bloque.id),
            })),
        [bloquesDisponibles, selectedBloques]
    );
    

    useEffect(() => {
        const selectedRows = bloquesMarcados.filter((b) => b.seleccionado);
        if (JSON.stringify(selectedRows) !== JSON.stringify(selectedBloques)) {
            onChange(selectedRows);
        }
    }, [bloquesMarcados, onChange]);




    const handleVerEjercicios = async (bloque) => {
        if (!bloque || !bloque.id) {
            console.warn("⚠️ No se puede obtener ejercicios: bloque inválido", bloque);
            return;
        }
    
        try {
            console.log(`📡 Obteniendo ejercicios para bloque ID: ${bloque.id}`);
            const response = await apiGetEjerciciosByBloque(bloque.id);
            console.log("✅ Ejercicios obtenidos:", response.data?.data);
    
            setEjercicios(response.data?.data || []);
            setBloqueSeleccionado(bloque);
            setDialogIsOpen(true);
        } catch (error) {
            console.error("❌ Error al obtener ejercicios:", error);
        }
    };

    return (
        <div>
            <h3 className="text-lg font-bold mb-4">Seleccionar Bloques</h3>

            {loading ? (
                <Spinner />
            ) : bloquesMarcados.length === 0 ? (
                <p className="text-gray-500 text-center p-4">
                    ❌ Cuando creaste la rutina, no asociaste bloques
                </p>
            ) : (
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
                        {bloquesMarcados.map((bloque, index) => (
                            <Tr key={bloque.id || index}>
                                <Td>
                                    <Checkbox
                                        checked={bloque.seleccionado}
                                        onChange={(checked) => {
                                            const updated = checked
                                                ? [...selectedBloques, bloque]
                                                : selectedBloques.filter(
                                                    (b) => b.id !== bloque.id
                                                );
                                            onChange(updated);
                                        }}
                                    />s
                                </Td>
                                <Td>{index + 1}</Td>
                                <Td>{bloque.descripcion}</Td>
                                <Td>
                                    <Tag
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
                                            <strong>Reps:</strong>{" "}
                                            {ejercicio.repeticiones}
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
                    <Button onClick={() => setDialogIsOpen(false)}>Cerrar</Button>
                </div>
            </Dialog>
        </div>
    );
};

export default SelectBloques;
