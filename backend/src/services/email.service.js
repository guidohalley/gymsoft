import nodemailer from 'nodemailer';
import logger from '../utils/logger.js';

// Validación de parámetros del transportador
const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD } = process.env;

if (!EMAIL_HOST) {
  throw new Error('El parámetro "EMAIL_HOST" no está definido en las variables de entorno.');
}
if (!EMAIL_PORT) {
  throw new Error('El parámetro "EMAIL_PORT" no está definido en las variables de entorno.');
}
if (!EMAIL_USER) {
  throw new Error('El parámetro "EMAIL_USER" no está definido en las variables de entorno.');
}
if (!EMAIL_PASSWORD) {
  throw new Error('El parámetro "EMAIL_PASSWORD" no está definido en las variables de entorno.');
}

// Crea un transporter para enviar correos electrónicos
let transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD
  }
});

/**
 * Envía un correo electrónico con un link de validación.
 * @param {string} to Dirección de correo electrónico del destinatario.
 * @param {string} validationLink Link de validación que el usuario debe seguir.
 */
const sendMail = (para, asunto,mensaje) => {
  return new Promise((resolve, reject) => {
    const message = {
      from: process.env.EMAIL_FROM,
      to: para,
      subject: asunto,
      text: mensaje
    };

    transporter.sendMail(message, (error, info) => {
      if (error) {
        reject(new Error('Error al enviar email: ' + error));
      } else {
        logger.info(`Se envio un email a ${para}`);
        resolve(info);
      }
    });
  }); 
}

export default sendMail;