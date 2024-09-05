import usuarioService from '../services/usuario.service.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import { mensajeError, mensajeExito } from '../utils/responseHandler.util.js';
import HTTP_STATUS from '../constants/httpStatusCodes.js';

const __fileName = 'acceso.controller.js';

export const login = async (req, res, next) => {
    const { email, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(mensajeError('Solicitud incorrecta', HTTP_STATUS.BAD_REQUEST, errors.array()));
    }

    try {

        const usuario = await usuarioService.findByEmailLogin(email);

        if (!usuario) {
            return next(mensajeError('Credenciales Invalidas', HTTP_STATUS.UNAUTHORIZED));
        }

        const passwordValida = await bcrypt.compare(password, usuario.password);

        if (!passwordValida) {
            return next(mensajeError('Credenciales Invalidas', HTTP_STATUS.UNAUTHORIZED));
        }

        const secretKey = process.env.JWT_SECRET;
        if (!secretKey) {
            return next(mensajeError('Error interno, JWT_SECRET no esta definido', HTTP_STATUS.INTERNAL_SERVER_ERROR, null, __archivo, 'login'));
        }   

        const sesionUsuario = {
            usuarioId: usuario.id,
            email: usuario.email,
            gimnasioId: usuario.gimnasioId
        };

        const token = jwt.sign(sesionUsuario, secretKey, { expiresIn: '6h' });
        res.json(mensajeExito('Login correcto', 200, { token }));
    } catch (error) {
        return next(mensajeError("Error en el login", HTTP_STATUS.INTERNAL_SERVER_ERROR, null, __fileName, 'login', error));
    }
};
