import { Router } from 'express';
import {body,param} from 'express-validator';
import tiposClasesController from '../controllers/tiposClases.controller.js';

const router = Router();
const descripcionMaxLength = 128;

const validarCreacion = [
    body('descripcion')
    .isLength({ max: descripcionMaxLength })
    .withMessage(`La longitud maxima es ${descripcionMaxLength}`)
    .notEmpty().withMessage('El descripcion es requerido'),
];

const validarActualizacion = [
    body('descripcion').isLength({ max: descripcionMaxLength }).withMessage(`La longitud maxima es ${descripcionMaxLength}`),
    body('activo').optional().isBoolean(true).withMessage('El campo activo es invalido'),
    body('esGlobal').optional().isBoolean(true).withMessage('El campo esGlobal es invalido'),
];

const validarId = [
    param('id').isNumeric().withMessage('El id debe ser un numero'),
];

router.post('/',validarCreacion,tiposClasesController.create);
router.get('/',tiposClasesController.getAll );
router.get('/:id', tiposClasesController.getById);
router.put('/:id',validarId.concat(validarActualizacion),tiposClasesController.update);
router.delete('/:id',validarId,tiposClasesController.remove);


export default router;
