import commonService from '../services/common.service.js';
import { getAll as getAllRutinas,getAllBloques,asociarBloques, desasociarBloques} from '../services/rutinas.service.js';
import { validationResult } from 'express-validator';
import { mensajeError, mensajeExito } from '../utils/responseHandler.util.js';
import HTTP_STATUS from '../constants/httpStatusCodes.js';

const __fileName = 'rutinas.controller.js';
const model = 'Rutina';

const create = async (req, res,next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(mensajeError('Solicitud incorrecta', HTTP_STATUS.BAD_REQUEST, errors.array()));
    }

    try {
        const { nombre,descripcion,estadoId } = req.body;
        const { usuarioId,gimnasioId } = req.payload;

        const data = {
            nombre: nombre,
            descripcion:descripcion,
            estadoId:estadoId,
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
        const { nombre,descripcion, activo,page = 1, limit = 10 } = req.query;

        const datos = await getAllRutinas(gimnasioId,{
            nombre: nombre,
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
        const { nombre,descripcion,estadoId } = req.body;
        const { gimnasioId } = req.payload;

        const datoExistente = await commonService.getById(model,id,gimnasioId);

        if(datoExistente === null) {
            return next(mensajeError('No se encontraron datos', HTTP_STATUS.NOT_FOUND));
        }

        await commonService.update(model,id,{nombre,descripcion,estadoId});
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

        await commonService.update(model,id,{ estadoId: 3 });

        res.json(mensajeExito('Se elimino el elemento', HTTP_STATUS.OK));
    } catch (error) {
        return next(mensajeError("Error al eliminar los datos", HTTP_STATUS.INTERNAL_SERVER_ERROR, null, __fileName, 'remove', error));
    }
    
}

const getBloques = async (req, res,next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(mensajeError('Solicitud incorrecta', HTTP_STATUS.BAD_REQUEST, errors.array()));
    }

    try{
        const {id} = req.params;
        const {gimnasioId} = req.payload;

        const rutina = await commonService.getById(model,id,gimnasioId);
      
        if(!rutina){
            return next(mensajeError('No se encontro la rutina', HTTP_STATUS.NOT_FOUND));
        }

        const bloques =  await getAllBloques(Number(id));

        res.json(mensajeExito('Datos encontrados', HTTP_STATUS.OK, bloques));
    }catch(error){
        return next(mensajeError("Error al obtener los datos", HTTP_STATUS.INTERNAL_SERVER_ERROR, null, __fileName, 'getBloques', error));
    }
}


const addBloques = async (req, res,next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(mensajeError('Solicitud incorrecta', HTTP_STATUS.BAD_REQUEST, errors.array()));
    }

    try {
        const {id} = req.params;
        const {gimnasioId} = req.payload;
        const {bloquesId} = req.body;

        const rutina = await commonService.getById(model,id,gimnasioId);

        if(!rutina){
            return next(mensajeError('No se encontro la rutina', HTTP_STATUS.NOT_FOUND));
        }

        if(!Array.isArray(bloquesId) || bloquesId.length === 0){
            return next(mensajeError('Se esperaba un array de datos', HTTP_STATUS.BAD_REQUEST));
        }
        
        const errores = [];
        await Promise.all(bloquesId.map(async (bloqueId) => {
            const bloque = await commonService.getById('Bloque', bloqueId, gimnasioId);
            if (!bloque) {
                errores.push(`No se encontró el bloque ${bloqueId}`);
            }
        }));    

        if (errores.length > 0) {
            return next(mensajeError(`Errores: ${errores.join(', ')}`, HTTP_STATUS.BAD_REQUEST));
        }

        //Inserto unicamente los bloques que no esten asociados a la rutina
        const bloques =  await getAllBloques(Number(id));
        const bloquesAInsertar =  bloquesId.filter(bloqueId => !bloques.some(bloque => bloque.id === bloqueId));
        
        const bloquesInsertados = await asociarBloques(Number(id),bloquesAInsertar);
        res.json(mensajeExito(`Se agregaron ${bloquesInsertados.count} bloques a la rutina`, HTTP_STATUS.OK));
    } catch (error) {
        return next(mensajeError(`Error al agregar bloques a la rutina` , HTTP_STATUS.INTERNAL_SERVER_ERROR, null, __fileName, 'addBloques', error));
    }  
}

const deleteBloques = async (req, res,next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(mensajeError('Solicitud incorrecta', HTTP_STATUS.BAD_REQUEST, errors.array()));
    }

    try {
        const {id} = req.params;
        const {gimnasioId} = req.payload;
        const {bloquesId} = req.body;

        const rutina = await commonService.getById(model,id,gimnasioId);

        if(!rutina){
            return next(mensajeError('No se encontro la rutina', HTTP_STATUS.NOT_FOUND));
        }

        if(!Array.isArray(bloquesId)){
            return next(mensajeError('Se esperaba un array de datos', HTTP_STATUS.BAD_REQUEST));
        }
       
        const bloquesEliminados = await desasociarBloques(Number(id),bloquesId);
        res.json(mensajeExito(`Se eliminaron ${bloquesEliminados.count} bloques de la rutina`, HTTP_STATUS.OK));

    } catch (error) {
        return next(mensajeError(`Error al agregar bloques a la rutina` , HTTP_STATUS.INTERNAL_SERVER_ERROR, null, __fileName, 'addBloques', error));
    }
}

export default {
    getAll,
    getById,
    create,
    update,
    remove,
    addBloques,
    deleteBloques,
    getBloques
}