import { Router } from 'express';
import {body,param} from 'express-validator';
import clasesController from '../controllers/clases.controller.js';

const router = Router();
const descripcionMaxLength = 128;

const validarCreacion = [
    body('descripcion').isLength({ max: descripcionMaxLength }).withMessage(`La longitud maxima de la descripcion es de  ${descripcionMaxLength}`)
    .notEmpty().withMessage('La descripcion es requerida'),
    body('fechaInicio').isDate().withMessage(`La fecha inicio debe tener formato de fecha`)
    .notEmpty().withMessage('La fecha de inicio es requerida'),
    body('fechaFin').isDate().withMessage(`La fecha fin debe tener formato de fecha`)
    .notEmpty().withMessage('La fecha de fin es requerida'),
    body('tipoClaseId').isNumeric().withMessage(`El tipo de clase debe ser numerica `).notEmpty().withMessage('El tipo de clase es requerido'),
];

const validarActualizacion = [
    body('descripcion').isLength({ max: descripcionMaxLength }).withMessage(`La longitud maxima de la descripcion es ${descripcionMaxLength}`),
    body('fechaInicio').optional().isDate().withMessage(`La fecha inicio debe tener formato de fecha`),
    body('fechaFin').optional().isDate().withMessage(`La fecha fin debe tener formato de fecha`),
    body('tipoClaseId').isNumeric().withMessage(`El tipo de clase debe ser numerico`),
    body('activo').optional().isBoolean(true).withMessage('El campo activo es invalido')
];

const validarId = [
    param('id').isNumeric().withMessage('El id debe ser un numero'),
];

router.post('/',validarCreacion,clasesController.create);
router.get('/',clasesController.getAll );
router.get('/:id', clasesController.getById);
router.put('/:id',validarId.concat(validarActualizacion),clasesController.update);
router.delete('/:id',validarId,clasesController.remove);


export default router;
