import { Router } from "express";
import bloquesEjerciciosController from "../controllers/bloquesEjercicios.controller.js";

const router = Router();

router.post('/:bloqueId',bloquesEjerciciosController.create);
router.get('/:bloqueId',bloquesEjerciciosController.getAll);
router.put('/:bloqueId/ejercicio/:idEjercicio',bloquesEjerciciosController.update);
router.get('/:bloqueId/ejercicio/:idEjercicio',bloquesEjerciciosController.getBloqueEjercicio);
router.delete('/:bloqueId/ejercicio/:idEjercicio',bloquesEjerciciosController.deleteBloqueEjercicio);

export default router;