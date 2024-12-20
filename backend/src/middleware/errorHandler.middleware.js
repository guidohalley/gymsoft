import logger from "../utils/logger.js";

// Función para generar logs de error
const logError = (
  { error, status, file, functionCalled, endpoint, message, request },
  level = "info"
) => {
  const logData = {
    status,
    message,
    file: file || "unknown",
    function: functionCalled || "unknown",
    endpoint,
    requestBody: request.body || {},
    requestQuery: request.query || {},
    errorDetails: error,
  };

  if (level === "info") {
    logger.info(JSON.stringify(logData));
  } else {
    logger.error(JSON.stringify(logData));
  }

  if (process.env.NODE_ENV === "dev") {
    console.error(logData);
  }
};

// Middleware de manejo de errores
const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || 500;

  // Información detallada del error
  const errorLogInfo = {
    error: err.originalError || err.stack || err,
    status: statusCode,
    file: err.file,
    functionCalled: err.functionCalled,
    endpoint: `${req.method} ${req.originalUrl}`,
    message: err.message || "Internal Server Error",
    request: {
      body: req.body,
      query: req.query,
    },
  };

  // Log según el tipo de error
  if (statusCode >= 500) {
    logError(errorLogInfo, "error");
  } else if (statusCode >= 400 && statusCode < 500) {
    logError(errorLogInfo, "info");
  }

  // Respuesta al cliente
  const response = {
    ok: false,
    method: req.method,
    status: statusCode,
    message: err.message || "Internal Server Error",
    info: err.data || null,
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
  };

  res.status(statusCode).json(response);
};

export default errorHandler;
