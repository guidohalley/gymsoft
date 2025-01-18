import {Router} from 'express';
import commonService from '../services/common.service.js';
import { mensajeError, mensajeExito } from '../utils/responseHandler.util.js';
import HTTP_STATUS from '../constants/httpStatusCodes.js';

const router = Router();

const modelosValidos = {
    rutinas: 'EstadoRutina',
    // De ser necesario otro estado agregar aca otro modelo
};

router.get('/:entidad', async (req, res,next) => {
    try {
        const {entidad} = req.params;

        const modelo = modelosValidos[entidad];
        if (!modelo) {
            return next(mensajeError('Entidad no válida', HTTP_STATUS.BAD_REQUEST));
        }
        
        const estados = await  commonService.getAllGeneric(modelo);
        res.json(mensajeExito('Estados encontrados',  HTTP_STATUS.OK, estados));
    } catch (error) {
        next(mensajeError(`Èrror al buscar los estados de la entindad ${entidad}`, HTTP_STATUS.INTERNAL_SERVER_ERROR, error.message));
    }
});

export default router;