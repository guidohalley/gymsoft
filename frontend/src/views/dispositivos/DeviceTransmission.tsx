import React, { useEffect, useState, useRef } from 'react';
import Select from '@/components/ui/Select';
import Dialog from '@/components/ui/Dialog';
import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import { CgGym } from "react-icons/cg";
import { apiGetClaseRutina, apiGetClases } from '@/services/ClasesService';
import EjercicioCard from '@/views/dispositivos/components/EjercicioCard';
import CustomEjercicioCard from './components/CustomEjercicioCard';

interface IndeterminateCheckboxProps extends Omit<CheckboxProps, 'onChange'> {
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    indeterminate: boolean;
}

const IndeterminateCheckbox: React.FC<IndeterminateCheckboxProps> = ({ indeterminate, onChange, ...rest }) => {
    const ref = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (typeof indeterminate === 'boolean' && ref.current) {
            ref.current.indeterminate = !rest.checked && indeterminate;
        }
    }, [ref, indeterminate]);

    return <Checkbox ref={ref} onChange={(_, e) => onChange(e)} {...rest} />;
};

const DeviceTransmission: React.FC = () => {
    const [claseId, setClaseId] = useState<number | null>(null);
    const [clasesOptions, setClasesOptions] = useState<any[]>([]);
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false);
    const [selectedExercises, setSelectedExercises] = useState<number[]>([]);

    useEffect(() => {
        const fetchClases = async () => {
            try {
                const response = await apiGetClases();
                const options = response.data.data.map((clase: any) => ({
                    value: clase.id,
                    label: clase.descripcion,
                }));
                setClasesOptions(options);
            } catch (err) {
                setError('Error al cargar las clases');
            }
        };

        fetchClases();
    }, []);

    useEffect(() => {
        if (claseId) {
            const fetchData = async () => {
                setLoading(true);
                try {
                    const response = await apiGetClaseRutina(claseId);
                    setData(response.data.data);
                } catch (err) {
                    setError('Error al cargar los datos');
                } finally {
                    setLoading(false);
                }
            };

            fetchData();
        }
    }, [claseId]);

    const handleClaseChange = (selectedOption: any) => {
        setClaseId(selectedOption.value);
        setData(null);
        setError(null);
    };

    const handleExerciseChange = (exerciseId: number) => {
        setSelectedExercises((prevSelected) =>
            prevSelected.includes(exerciseId)
                ? prevSelected.filter((id) => id !== exerciseId)
                : [...prevSelected, exerciseId]
        );
    };

    const openDialog = () => {
        setDialogIsOpen(true);
    };

    const closeDialog = () => {
        setDialogIsOpen(false);
    };

    const handleDialogOk = () => {
        setDialogIsOpen(false);
    };

    return (
        <div>
            <Button variant="plain" size='xs' icon={<CgGym/>} onClick={openDialog}/>
            <Dialog isOpen={dialogIsOpen} onClose={closeDialog} onRequestClose={closeDialog}>
                <h5 className="mb-4">Seleccionar Rutina y Ejercicios</h5>
                <Select
                    options={clasesOptions}
                    onChange={handleClaseChange}
                    placeholder="Seleccione una clase"
                />
                {loading && <p>Cargando...</p>}
                {error && <p>{error}</p>}
                {data && (
                    <div>
                        <h5 className="mb-4">Ejercicios que va a mostrar este dispositivo</h5>
                        {data.rutina.rutinaBloques.map((bloque: any) =>
                            bloque.bloque.bloquesEjercicios.map((ejercicio: any) => (
                                <div key={ejercicio.ejercicioId} className="flex items-center mb-2">
                                    <IndeterminateCheckbox
                                        className="mr-2"
                                        checked={selectedExercises.includes(ejercicio.ejercicioId)}
                                        onChange={() => handleExerciseChange(ejercicio.ejercicioId)}
                                        indeterminate={false}
                                    />
                                    <label>{ejercicio.ejercicio.nombre}</label>
                                </div>
                            ))
                        )}
                    </div>
                )}
                <div className="text-right mt-6">
                    <Button className="ltr:mr-2 rtl:ml-2" variant="plain" onClick={closeDialog}>
                        Cancelar
                    </Button>
                    <Button variant="solid" onClick={handleDialogOk}>
                        Aceptar
                    </Button>
                </div>
            </Dialog>
            {selectedExercises.length > 0 && (
                <div className="w-full h-[77vh] overflow-hidden p-2 flex justify-center items-center">
                    <div
                        className={`
                            grid gap-2 w-full h-full place-items-center
                            ${selectedExercises.length <= 3 ? 'grid-cols-3 grid-rows-1' : ''} 
                            ${selectedExercises.length === 4 ? 'grid-cols-2 grid-rows-2' : ''} 
                            ${selectedExercises.length > 4 ? 'grid-cols-3 grid-rows-2' : ''}
                        `}
                    >
                        {data?.rutina.rutinaBloques.map((bloque: any) =>
                            bloque.bloque.bloquesEjercicios
                                .filter((ejercicio: any) => selectedExercises.includes(ejercicio.ejercicioId))
                                .map((ejercicio: any) => (
                                    <div 
                                        key={ejercicio.ejercicioId} 
                                        className="w-[90%] h-[90%] flex justify-center items-center"
                                    >
                                        <CustomEjercicioCard ejercicio={ejercicio.ejercicio} />
                                    </div>
                                ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeviceTransmission;