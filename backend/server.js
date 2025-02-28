import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import errorHandler from './src/middleware/errorHandler.middleware.js';
import apiRouter from './src/routes/api.router.js';

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());
app.use(helmet());

app.use('/api', apiRouter);

// Middleware de manejo de errores
app.use(errorHandler);

// Middleware para manejar rutas no definidas
app.use((req, res, next) => {
    return res.status(404).json({ error: 'No se encontro el recurso que estas buscando' });
});

if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.HOST_PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en el puerto: ${PORT}`);
    });
}

export default app;