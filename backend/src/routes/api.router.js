import { Router } from 'express';
import validarToken from '../middleware/validarToken.middleware.js';
import accesoRouter from './acceso.router.js';
import musculosRouter from './musculos.router.js';
import categoriasEjercicioRouter from './categoriasEjercicio.js';

const apiRouter = Router();

apiRouter.get("/", (req, res) => {
  res.json({ message: "Api OK" });
});

//Endpoints publicos
apiRouter.use('/acceso', accesoRouter);

//Endpoints privados
apiRouter.use('/musculos', validarToken, musculosRouter);
apiRouter.use('/categorias-ejercicio', validarToken, categoriasEjercicioRouter);


export default apiRouter;