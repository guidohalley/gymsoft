import { Router } from 'express';
import {body,param} from 'express-validator';
import rutinasController from '../controllers/rutinas.controller.js';

const router = Router();

const nombreMaxLength = 128;
const descripcionLength = 255;

const validarCreacion = [
    body('nombre')
    .isLength({ max: nombreMaxLength })
    .withMessage(`La longitud maxima del nombre es de ${nombreMaxLength}`)
    .notEmpty().withMessage('El nombre es requerido'),
    body('descripcion')
    .isLength({ max: descripcionLength })
    .withMessage(`La longitud maxima de la descripcion es de ${descripcionLength}`)
    .notEmpty().withMessage('La descripcion es requerida'),
    body('estado_id').optional().isNumeric(true).withMessage('El campo estado es invalido')
];

const validarActualizacion = [
    body('nombre').isLength({ max: nombreMaxLength }).withMessage(`La longitud maxima es ${nombreMaxLength}`),
    body('estado').optional().isNumeric(true).withMessage('El campo estado es invalido'),
    body('descripcion').isLength({ max: descripcionLength }).withMessage(`La longitud maxima de la escripcion es de ${descripcionLength}`),
];

const validarId = [
    param('id').isNumeric().withMessage('El id debe ser un numero'),
];

router.post('/',validarCreacion,rutinasController.create);
router.get('/',rutinasController.getAll );
router.get('/:id', rutinasController.getById);
router.put('/:id',validarId.concat(validarActualizacion),rutinasController.update);
router.delete('/:id',validarId,rutinasController.remove);

router.get('/:id/bloques',validarId,rutinasController.getBloques);
router.post('/:id/bloques',validarId,rutinasController.addBloques);
router.delete('/:id/bloques',validarId,rutinasController.deleteBloques);


export default router;
