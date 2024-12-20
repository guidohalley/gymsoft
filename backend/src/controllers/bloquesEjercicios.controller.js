import commonService from '../services/common.service.js';
import {asociarBloquesEjercicios,getAllBloqueEjercicios,updateBloqueEjercicio,getBloqueEjercicioById,deleteBloqueEjercicioById} from '../services/bloques.service.js';
import { validationResult } from 'express-validator';
import { mensajeError, mensajeExito } from '../utils/responseHandler.util.js';
import HTTP_STATUS from '../constants/httpStatusCodes.js';

const __fileName = 'bloquesEjercicios.controller.js';
const model = 'BloqueEjercicio';

const create = async (req, res,next) => {
    try {
        const { bloqueId } = req.params;
        const { ejercicios } = req.body; 
        const { gimnasioId } = req.payload;

        const bloque = await commonService.getById('Bloque', bloqueId, gimnasioId);

        if(!bloque){
            return next(mensajeError("El bloque no existe", HTTP_STATUS.NOT_FOUND, null, __fileName, 'create'));
        }

         // Validar que el array de ejercicios no esté vacío
        if (!Array.isArray(ejercicios) || ejercicios.length === 0) {
            return next(mensajeError("'Debe enviar uno o varios de ejercicios'", HTTP_STATUS.BAD_REQUEST, null, __fileName, 'create'));
        }

        const data = ejercicios.map(e => ({
            bloqueId: Number(bloqueId),
            ejercicioId: Number(e.ejercicioId),
            orden: e.orden || 1,
            repeticiones: e.repeticiones || null,
            series: e.series || null,
            descanso: e.descanso || null,
            peso: e.peso || null,
        }));

        const ejerciciosCreados = await asociarBloquesEjercicios(data);

        res.json(mensajeExito('Nuevo elemento creado', HTTP_STATUS.CREATED, ejerciciosCreados));

    } catch (error) {
        let http_status = HTTP_STATUS.INTERNAL_SERVER_ERROR;
        let info = 'Error al crear nuevo elemento';
        if (error.code === 'P2002') {
            // Manejo específico para el error de restricción única
            http_status = HTTP_STATUS.CONFLICT;
            info = 'Ya existe un registro con los mismos campos únicos.';
        }
        return next(mensajeError(info, http_status, null, __fileName, 'crear', error));
    }
}

const getAll = async (req,res, next) => {
    try {
        const { bloqueId } = req.params;
        const { gimnasioId } = req.payload;

        const bloque = await commonService.getById('Bloque', bloqueId, gimnasioId);

        if(!bloque){
            return next(mensajeError("El bloque no existe", HTTP_STATUS.NOT_FOUND, null, __fileName, 'getAll'));
        }

        const ejercicios = await getAllBloqueEjercicios(bloqueId);

        res.json(mensajeExito('Lista de elementos', HTTP_STATUS.OK, ejercicios));

    } catch (error) {
        return next(mensajeError("Error al obtener elementos", HTTP_STATUS.INTERNAL_SERVER_ERROR, null, __fileName, 'getAll', error));
    }
}

const getBloqueEjercicio = async (req,res,next) => { 
    try {
        const { bloqueId, idEjercicio } = req.params;

        const ejercicio = await getBloqueEjercicioById(bloqueId,idEjercicio);

        if(!ejercicio){
            return next(mensajeError("El elemento no existe", HTTP_STATUS.NOT_FOUND, null, __fileName, 'getById'));
        }

        res.json(mensajeExito('Elemento encontrado', HTTP_STATUS.OK, ejercicio));
    } catch (error) {
        return next(mensajeError("Error al obtener elemento", HTTP_STATUS.INTERNAL_SERVER_ERROR, null, __fileName, 'getById', error));
    }
}

const update = async (req,res,next) => {
    try {
        const { bloqueId, idEjercicio } = req.params;
        const { orden,repeticiones,series,descanso,peso } = req.body;

        const ejercicio = await getBloqueEjercicioById(bloqueId,idEjercicio);

        if(!ejercicio){
            return next(mensajeError("El elemento no existe", HTTP_STATUS.NOT_FOUND, null, __fileName, 'update'));
        }

        const data = {
            orden: orden || 1,
            repeticiones: repeticiones || null,
            series: series || null,
            descanso: descanso || null,
            peso: peso || null,
        };

        await updateBloqueEjercicio(bloqueId, idEjercicio, data);

        res.json(mensajeExito('Elemento actualizado', HTTP_STATUS.OK, null));

    } catch (error) {
        return next(mensajeError("Error al actualizar elemento", HTTP_STATUS.INTERNAL_SERVER_ERROR, null, __fileName, 'update', error));
    }
}

const deleteBloqueEjercicio = async (req,res,next) => {
    try {
        const { bloqueId, idEjercicio } = req.params;

        const ejercicio = await getBloqueEjercicioById(bloqueId,idEjercicio);
        if(!ejercicio){
            return next (mensajeError("El elemento no existe", HTTP_STATUS.NOT_FOUND, null, __fileName, 'delete'));
        }

        await deleteBloqueEjercicioById(bloqueId,idEjercicio);

        res.json(mensajeExito('Elemento eliminado', HTTP_STATUS.OK, null));
    }
    catch (error) {
        return next(mensajeError("Error al eliminar elemento", HTTP_STATUS.INTERNAL_SERVER_ERROR, null, __fileName, 'delete', error));
    }
}

export default {
    create,
    getAll,
    update,
    getBloqueEjercicio,
    deleteBloqueEjercicio
}