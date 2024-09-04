import { Router } from 'express';
import validarToken from '../middleware/validarToken.middleware.js';
import accesoRouter from './acceso.router.js';

const apiRouter = Router();

apiRouter.get("/", (req, res) => {
  res.json({ message: "Api OK" });
});

//Endpoints publicos
apiRouter.use('/acceso', accesoRouter);

//Endpoints privados
apiRouter.use('/acceso', validarToken, accesoRouter);


export default apiRouter;