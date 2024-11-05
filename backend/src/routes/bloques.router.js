import { Router } from 'express';
import {body,param} from 'express-validator';
import bloquesController from '../controllers/bloques.controller.js';

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
    body('activo').optional().isBoolean(true).withMessage('El campo activo es invalido')
];

const validarId = [
    param('id').isNumeric().withMessage('El id debe ser un numero'),
];

router.post('/',validarCreacion,bloquesController.create);
router.get('/',bloquesController.getAll );
router.get('/:id', bloquesController.getById);
router.put('/:id',validarId.concat(validarActualizacion),bloquesController.update);
router.delete('/:id',validarId,bloquesController.remove);


export default router;
