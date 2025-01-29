import commonService from '../services/common.service.js';
import { getAll as getAllClases,getRutina } from '../services/clases.service.js'
import { validationResult } from 'express-validator';
import { mensajeError, mensajeExito } from '../utils/responseHandler.util.js';
import HTTP_STATUS from '../constants/httpStatusCodes.js';

const __fileName = 'clases.controller.js';
const model = 'Clase';

const create = async (req, res,next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(mensajeError('Solicitud incorrecta', HTTP_STATUS.BAD_REQUEST, errors.array()));
    }

    try {
        const { descripcion,fechaInicio,fechaFin,tipoClaseId,rutinaId} = req.body;
        const { usuarioId,gimnasioId } = req.payload;

        const fechaInicioFormateada = new Date(fechaInicio); 
        const fechaFinFormateada = new Date(fechaFin); 

        const data = {
            descripcion: descripcion,
            fechaInicio: fechaInicioFormateada,
            fechaFin: fechaFinFormateada,
            rutinaId: rutinaId ?? null,
            tipoClaseId:tipoClaseId,
            gimnasioId: gimnasioId,
            creadoPor: usuarioId
        };

        const nuevaFila = await commonService.create(model,data);

        res.json(mensajeExito('Nuevo elemento creado', HTTP_STATUS.CREATED, nuevaFila));

    } catch (error) {
        return next(mensajeError("Error al crear nuevo elemento", HTTP_STATUS.INTERNAL_SERVER_ERROR, null, __fileName, 'crear', error));
    }
}


const getAll = async (req, res,next) => {
    try {
        const { gimnasioId } = req.payload;
        const { descripcion, activo,page = 1, limit = 10 } = req.query;

        const datos = await getAllClases(model,gimnasioId,{
            descripcion: descripcion,
            activo: activo !== undefined ? activo === 'true' : undefined,
            page: parseInt(page),
            limit: parseInt(limit)
        });

        res.json(mensajeExito('Datos encontrados', HTTP_STATUS.OK, datos));
    } catch (error) {
        return next(mensajeError("Error al obtener los datos", HTTP_STATUS.INTERNAL_SERVER_ERROR, null, __fileName, 'getAll', error));
    }
}

const getById = async (req, res,next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(mensajeError('Solicitud incorrecta', HTTP_STATUS.BAD_REQUEST, errors.array()));
    }

    try {
        const { id } = req.params;
        const { gimnasioId } = req.payload;

        if(id === undefined || id === null) {
            return next(mensajeError('El id no puede estar vacio', HTTP_STATUS.BAD_REQUEST));
        }

        const datoExistente = await commonService.getById(model,id,gimnasioId);

        if(datoExistente === null) {
            return next(mensajeError('No se encontraron datos', HTTP_STATUS.NOT_FOUND));
        }
      
        res.json(mensajeExito('Datos encontrados', HTTP_STATUS.OK, datoExistente));
    } catch (error) {
        return next(mensajeError("Error al obtener los datos", HTTP_STATUS.INTERNAL_SERVER_ERROR, null, __fileName, 'getById', error));
    }
}

const update = async (req, res,next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(mensajeError('Solicitud incorrecta', HTTP_STATUS.BAD_REQUEST, errors.array()));
    }

    try {
        const { id } = req.params;
        const { descripcion,fechaInicio,fechaFin,tipoClaseId,rutinaId } = req.body;
        const { gimnasioId } = req.payload;

        const datoExistente = await commonService.getById(model,id,gimnasioId);

        if(datoExistente === null) {
            return next(mensajeError('No se encontraron datos', HTTP_STATUS.NOT_FOUND));
        }

        const fechaInicioFormateada = fechaInicio ? new Date(fechaInicio) : undefined; 
        const fechaFinFormateada = fechaFin ? new Date(fechaFin) : undefined;  

        const data = {
            descripcion: descripcion,
            fechaInicio: fechaInicioFormateada,
            fechaFin: fechaFinFormateada,
            tipoClaseId:tipoClaseId,
            rutinaId: rutinaId
        };

        const datoActualizado = await commonService.update(model,id,data);
        res.json(mensajeExito('Se actualizaron los datos', HTTP_STATUS.OK));
    } catch (error) {
        return next(mensajeError("Error al actualizar los datos", HTTP_STATUS.INTERNAL_SERVER_ERROR, null, __fileName, 'update', error));
    }   
}


const remove = async (req, res,next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(mensajeError('Solicitud incorrecta', HTTP_STATUS.BAD_REQUEST, errors.array()));
    }

    try {
        const { id } = req.params;
        const { gimnasioId } = req.payload;
        const datoExistente = await commonService.getById(model,id,gimnasioId);

        if(datoExistente === null) {
            return next(mensajeError('No se encontraron datos', HTTP_STATUS.NOT_FOUND));
        }

        await commonService.update(model,id,{ activo: false });

        res.json(mensajeExito('Se elimino el elemento', HTTP_STATUS.OK));
    } catch (error) {
        return next(mensajeError("Error al eliminar los datos", HTTP_STATUS.INTERNAL_SERVER_ERROR, null, __fileName, 'remove', error));
    }
}

const getRutinaVideos = async (req, res,next) => {
    try {
        const { id } = req.params;
        const { gimnasioId } = req.payload;
        const datoExistente = await commonService.getById(model,id,gimnasioId);

        if(datoExistente === null) {
            return next(mensajeError('No se encontraron datos', HTTP_STATUS.NOT_FOUND));
        }

        const rutina = await getRutina(id);

        res.json(mensajeExito('Datos encontrados', HTTP_STATUS.OK, rutina));
    } catch (error) {
        return next(mensajeError("Error al obtener los datos", HTTP_STATUS.INTERNAL_SERVER_ERROR, null, __fileName, 'getRutina', error));
    }
}

export default {
    getAll,
    getById,
    create,
    update,
    remove,
    getRutinaVideos
}