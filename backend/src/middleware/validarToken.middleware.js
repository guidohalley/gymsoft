import jwt from 'jsonwebtoken';
import HTTP_STATUS from '../constants/httpStatusCodes.js';
import { mensajeError } from '../utils/responseHandler.util.js';

const __fileName = 'validarToken.middleware.js';

function validarToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(mensajeError('Token no proporcionado', HTTP_STATUS.UNAUTHORIZED));
  }

  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next(mensajeError('Formato de Token invalido', HTTP_STATUS.UNAUTHORIZED));
  }

  const secretKey = process.env.JWT_SECRET;
  if (!secretKey) {
    return next(mensajeError('Error interno', HTTP_STATUS.INTERNAL_SERVER_ERROR, null, __fileName, 'validarToken', 'JWT_SECRET not defined'));
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return next(mensajeError('Token Invalido', HTTP_STATUS.UNAUTHORIZED));
    }

    req.payload = decoded;
    next();
  });
}

export default validarToken;