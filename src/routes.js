import { Router } from 'express';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/session', SessionController.store);

routes.use(authMiddleware);
/**
 * As rotas abaixo exigem autenticação
 */

export default routes;
