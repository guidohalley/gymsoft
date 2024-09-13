import { Router } from 'express';
import {body,param} from 'express-validator';
import dispositivosController from '../controllers/dispositivos.controller.js';

const router = Router();
const nombreMaxLength = 128;
const descripcionMaxLength = 255;

const validarCreacion = [
    body('nombre')
    .isLength({ max: nombreMaxLength })
    .withMessage(`La longitud maxima del nombre es ${nombreMaxLength}`)
    .notEmpty().withMessage('El nombre es requerido'),
    body('descripcion')
    .isLength({ max: descripcionMaxLength })
    .withMessage(`La longitud maxima de la descripicion es ${descripcionMaxLength}`)
    .notEmpty().withMessage('La descripcion es requerida'),
];

const validarActualizacion = [
    body('nombre').isLength({ max: nombreMaxLength }).withMessage(`La longitud maxima del nombre es ${nombreMaxLength}`),
    body('descripcion').isLength({ max: descripcionMaxLength }).withMessage(`La longitud maxima de la descripcion es ${descripcionMaxLength}`),
    body('activo').optional().isBoolean(true).withMessage('El campo activo es invalido'),
];

const validarId = [
    param('id').isNumeric().withMessage('El id debe ser un numero'),
];

router.post('/',validarCreacion,dispositivosController.create);
router.get('/',dispositivosController.getAll );
router.get('/:id', dispositivosController.getById);
router.put('/:id',validarId.concat(validarActualizacion),dispositivosController.update);
router.delete('/:id',validarId,dispositivosController.remove);


export default router;
