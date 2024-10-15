import logger from '../utils/logger.js';

const logError = ({error, status, file, functionCalled, endpoint,message}) => {
    const errorMessage = `${status} ${message}\nFile: ${file} \nFunction: ${functionCalled} \nEndpoint: ${endpoint}\n${error}`;
    logger.error(errorMessage);
    if (process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'test') {
        console.error(error);
    }
};

const errorHandler = (err, req, res,next)  => {
    const statusCode = err.status || 500;

    if(statusCode >= 500){
        const errorLogInfo = {
            error : err.originalError || err.stack || err,
            status: statusCode,
            file: err.file || 'unknown',
            functionCalled: err.functionCalled || 'unknown',
            endpoint : `${req.method} ${req.originalUrl}`,
            message: err.message || 'Internal Server Error'
        };

        logError(errorLogInfo);
    }

    //Establece el código de estado del error
    const response = {
        ok: false,
        method: req.method,
        status: statusCode,
        message: err.message || 'Internal Server Error',
        info: err.data || null,
        timestamp: new Date().toISOString(),
        path: req.originalUrl
    };

    res.status(err.status || 500).json(response);
}

export default errorHandler;