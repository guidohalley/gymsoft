import logger from '../utils/logger.js';

const mensajeError = (message = 'Error interno', status = 500, data = null,file = '',functionCalled = '', originalError = '') => {
    const error = new Error(message);
    error.status = status;
    error.data = data;
    error.file = file;
    error.functionCalled = functionCalled;
    error.originalError = originalError;
    return error;
};

const mensajeExito = (message = 'Exito', status = 200, data = null,) => {
    const response = {
        ok: true,
        status: status,
        message:message,
        data: data,
        timestamp: new Date().toISOString()
    };

    if(process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'test'){
        logger.info(`Respuesta: ${message}`);
    }

    return response;
}

export {
    mensajeError,
    mensajeExito
}