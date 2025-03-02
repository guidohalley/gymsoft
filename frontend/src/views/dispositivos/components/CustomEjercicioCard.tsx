import React, { useRef, useState, useEffect } from 'react';

interface EjercicioCardProps {
    ejercicio: {
        nombre: string;
        descripcion: string;
        url: string;
        categoriaEjercicio: {
            nombre: string;
        };
    };
}

const CustomEjercicioCard: React.FC<EjercicioCardProps> = ({ ejercicio }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isCached, setIsCached] = useState(false);
    const [aspectRatio, setAspectRatio] = useState(16 / 9); // Inicialmente 16:9

    useEffect(() => {
        const handleLoadedData = () => {
            if (videoRef.current) {
                videoRef.current.loop = true;
                setIsCached(true);

                // Detectar la proporción del video
                const videoWidth = videoRef.current.videoWidth;
                const videoHeight = videoRef.current.videoHeight;
                const ratio = videoWidth / videoHeight;
                setAspectRatio(ratio);
            }
        };

        if (videoRef.current) {
            videoRef.current.addEventListener('loadeddata', handleLoadedData);
        }

        return () => {
            if (videoRef.current) {
                videoRef.current.removeEventListener('loadeddata', handleLoadedData);
            }
        };
    }, []);

    return (
        <div 
            className="w-full overflow-hidden relative rounded-2xl bg-withe"
            style={{ height: `calc(100% / ${aspectRatio})` }} // Ajuste dinámico de altura
        >
            <video
                ref={videoRef}
                className="w-full h-full object-cover rounded-2xl"
                autoPlay
                muted 
            >
                <source src={ejercicio.url} type="video/mp4" />
            </video>
            {!isCached && (
                <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50">
                    <p className="text-white">Cargando...</p>
                </div>
            )}            
        </div>
    );
};

export default CustomEjercicioCard;
