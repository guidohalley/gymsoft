import { Router } from 'express';
import validarToken from '../middleware/validarToken.middleware.js';
import accesoRouter from './acceso.router.js';
import musculosRouter from './musculos.router.js';
import categoriasEjercicioRouter from './categoriasEjercicio.router.js';
import ejerciciosRouter from './ejercicios.router.js';
import tiposClasesRouter from './tiposClases.router.js';
import dispositivosRouter from './dispositivos.router.js';
import clasesRouter from './clases.router.js'
import rutinasRouter from './rutinas.router.js';
import bloquesRouter from './bloques.router.js';

const apiRouter = Router();

apiRouter.get("/", (req, res) => {
  res.json({ message: "Api OK" });
});

//Endpoints publicos
apiRouter.use('/acceso', accesoRouter);

//Endpoints privados
apiRouter.use('/musculos', validarToken, musculosRouter);
apiRouter.use('/categorias-ejercicio', validarToken, categoriasEjercicioRouter);
apiRouter.use('/ejercicios', validarToken, ejerciciosRouter);
apiRouter.use('/tipos-clases', validarToken, tiposClasesRouter);
apiRouter.use('/dispositivos', validarToken, dispositivosRouter);
apiRouter.use('/clases', validarToken, clasesRouter);
apiRouter.use('/rutinas', validarToken, rutinasRouter);
apiRouter.use('/bloques', validarToken, bloquesRouter);


export default apiRouter;