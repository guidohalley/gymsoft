import { Router } from 'express';
import {body,param} from 'express-validator';
import categoriasEjercicio from '../controllers/categoriasEjercicio.controller.js';

const router = Router();
const nombreMaxLength = 128;

const validarCreacion = [
    body('nombre')
    .isLength({ max: nombreMaxLength })
    .withMessage(`La longitud maxima es ${nombreMaxLength}`)
    .notEmpty().withMessage('El nombre es requerido'),
];

const validarActualizacion = [
    body('nombre').isLength({ max: nombreMaxLength }).withMessage(`La longitud maxima es ${nombreMaxLength}`),
    body('activo').optional().isBoolean(true).withMessage('El campo activo es invalido'),
    body('esGlobal').optional().isBoolean(true).withMessage('El campo esGlobal es invalido'),
];

const validarId = [
    param('id').isNumeric().withMessage('El id debe ser un numero'),
];

router.post('/',validarCreacion,categoriasEjercicio.create);
router.get('/',categoriasEjercicio.getAll );
router.get('/:id', categoriasEjercicio.getById);
router.put('/:id',validarId.concat(validarActualizacion),categoriasEjercicio.update);
router.delete('/:id',validarId,categoriasEjercicio.remove);


export default router;
