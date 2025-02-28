import multer from 'multer';
import path from 'path';

// Configurar Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/tmp')
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);

        // Verificar si es un archivo mp4
        if (ext !== '.mp4') {
            return cb(new Error('Solo se permiten archivos .mp4'));
        }
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + ext)
    }
})

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, 
    fileFilter: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        if (ext !== '.mp4') {
            return cb(new Error('Solo se permiten archivos .mp4'));
        }
        cb(null, true);
    }
})
// Exportar el middleware configurado
export const uploadMiddleware = upload.single('video');