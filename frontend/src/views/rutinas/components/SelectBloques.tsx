import { useSelectBloques } from "@/hooks/useSelectBloques";
import Checkbox from "@/components/ui/Checkbox";
import Spinner from "@/components/ui/Spinner";

const SelectBloques: React.FC<{ rutinaId?: number, selectedBloques: any[], onChange: (bloques: any[]) => void }> = ({ rutinaId, selectedBloques, onChange }) => {
    const { bloquesDisponibles, loading } = useSelectBloques(rutinaId);

    return (
        <div>
            <h3 className="text-lg font-bold mb-4">Seleccionar Bloques</h3>
            {loading ? (
                <Spinner />
            ) : (
                bloquesDisponibles.length > 0 ? (
                    bloquesDisponibles.map((bloque) => {
                        const isSelected = selectedBloques.some((b) => b.id === bloque.id);
                        return (
                            <div key={bloque.id} className="flex items-center gap-2">
                                <Checkbox
                                    checked={isSelected}
                                    onChange={(checked) => {
                                        const updated = checked
                                            ? [...selectedBloques, bloque]
                                            : selectedBloques.filter((b) => b.id !== bloque.id);
                                        onChange(updated);
                                    }}
                                />
                                <span>{bloque.descripcion}</span>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-gray-500">No hay bloques disponibles.</p>
                )
            )}
        </div>
    );
};

export default SelectBloques;
