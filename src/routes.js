import { Router } from 'express';
import multer from 'multer';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import UserController from './app/controllers/UserController';
import FileController from './app/controllers/FileController';
import DeliverymanController from './app/controllers/DeliverymanController';
import DeliveryController from './app/controllers/DeliveryController';
import DeliveryPickupController from './app/controllers/DeliveryPickupController';
import DeliveryCompleteController from './app/controllers/DeliveryCompleteController';
import DeliveryProblemController from './app/controllers/DeliveryProblemController';
import DeliveriesProblemsController from './app/controllers/DeliveriesProblemsController';
import CancelDeliveryController from './app/controllers/CancelDeliveryController';
import DeliverymanDeliveriesController from './app/controllers/DeliverymanDeliveriesController';
import DeliveredController from './app/controllers/DeliveredController';
import authMiddleware from './app/middlewares/auth';
import multerConfig from './config/multer';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/session', SessionController.store);

/**
 * Rotas do Entregador - Sem autenticação
 */
routes.put('/deliveries/:id/pickup', DeliveryPickupController.update);
routes.put(
  '/deliveries/:id/complete',
  upload.single('file'),
  DeliveryCompleteController.update
);

routes.get('/deliveries/problems', DeliveriesProblemsController.index);
routes.post('/delivery/:id/problems', DeliveryProblemController.store);
routes.get('/delivery/:id/problems', DeliveryProblemController.index);
routes.get(
  '/deliveryman/:id/deliveries',
  DeliverymanDeliveriesController.index
);
routes.get('/deliveryman/:id/delivered', DeliveredController.index);

routes.use(authMiddleware);
/**
 * As rotas abaixo exigem autenticação
 */
routes.get('/users', UserController.index);
routes.get('/users/:id', UserController.show);
routes.post('/users', UserController.store);

routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);
routes.get('/recipients', RecipientController.index);

routes.post('/files', upload.single('file'), FileController.store);

routes.get('/deliverymen', DeliverymanController.index);
routes.post('/deliverymen', DeliverymanController.store);
// routes.get('/deliverymen/:id', DeliverymanController.show);
routes.put('/deliverymen/:id', DeliverymanController.update);
routes.delete('/deliverymen/:id', DeliverymanController.delete);

routes.post('/deliveries', DeliveryController.store);
routes.get('/deliveries', DeliveryController.index);
routes.delete('/deliveries/:id', DeliveryController.delete);
routes.put('/deliveries/:id', DeliveryController.update);

routes.delete(
  '/problem/:problem_id/cancel-delivery',
  CancelDeliveryController.delete
);

export default routes;
