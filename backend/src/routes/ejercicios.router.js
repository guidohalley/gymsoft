import {Router} from 'express';
import {body,param} from 'express-validator';
import ejerciciosController from '../controllers/ejercicios.controller.js';
import { uploadMiddleware } from '../middleware/upload.middleware.js';

const router = Router();
const nombreMaxLength = 128;
const descripcionMaxLength = 255;
const pathMaxLength = 255;
const urlMaxLength = 255;

const validarCreacion = [
    body('nombre').isLength({ max: nombreMaxLength }).withMessage(`La longitud maxima es ${nombreMaxLength}`).notEmpty().withMessage('El nombre es requerido'),
    body('descripcion').isLength({ max: descripcionMaxLength }).withMessage(`La longitud maxima es ${descripcionMaxLength}`).notEmpty().withMessage('La descripcion es requerida'),
    body('path').isLength({ max: pathMaxLength }).withMessage(`La longitud maxima es ${pathMaxLength}`),
    body('url').isLength({ max: urlMaxLength }).withMessage(`La longitud maxima es ${urlMaxLength}`),
    body('categoriaEjercicioId').isNumeric().withMessage(`La categoria debe ser numerica ${urlMaxLength}`).notEmpty().withMessage('La categoria es requerida'),
    body('activo').optional().isBoolean(true).withMessage('El campo activo es invalido'),
    body('esGlobal').optional().isBoolean(true).withMessage('El campo esGlobal es invalido'),
];

const validarActualizacion = [
    body('nombre').isLength({ max: nombreMaxLength }).withMessage(`La longitud maxima es ${nombreMaxLength}`),
    body('descripcion').isLength({ max: descripcionMaxLength }).withMessage(`La longitud maxima es ${descripcionMaxLength}`),
    body('path').isLength({ max: pathMaxLength }).withMessage(`La longitud maxima es ${pathMaxLength}`),
    body('url').isLength({ max: urlMaxLength }).withMessage(`La longitud maxima es ${urlMaxLength}`),
    body('categoriaEjercicioId').isNumeric().withMessage(`La categoria debe ser numerica ${urlMaxLength}`),
    body('activo').optional().isBoolean(true).withMessage('El campo activo es invalido'),
    body('esGlobal').optional().isBoolean(true).withMessage('El campo esGlobal es invalido'),
];

const validarId = [
    param('id').isNumeric().withMessage('El id debe ser un numero'),
];

router.post('/',uploadMiddleware,ejerciciosController.create);
router.get('/',ejerciciosController.getAll );
router.get('/:id', ejerciciosController.getById);
router.put('/:id',uploadMiddleware,validarId,validarActualizacion,ejerciciosController.update);
router.delete('/:id',validarId,ejerciciosController.remove);

export default router;