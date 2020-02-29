import { Router } from 'express';

import multer from 'multer';
import multerAvatar from './config/multerAvatar';
import multerSignature from './config/multerSignature';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import DeliverymanController from './app/controllers/DeliverymanController';
import AvatarController from './app/controllers/AvatarController';
import OrderController from './app/controllers/OrderController';

import auth from './app/middlewares/auth';

const routes = new Router();

/*
 Pensando na escalabilidade do sistema, saber diferenciar os arquivos de signature
  com os de avatar pode ser uma vantagem, principalmente se pensarmos em uma padronizacao
  de tamanho do arquivo, usando por exemplo um tamanho especifico para imagem
  E outra para as assinaturas usando uma dependencia como sharp
*/

const uploadAvatar = multer(multerAvatar);
const uploadSignature = multer(multerSignature);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(auth);

routes.put('/users', UserController.update);
routes.post('/recipients', RecipientController.store);
routes.put('/recipients', RecipientController.update);

routes.get('/deliverymans', DeliverymanController.index);
routes.post('/deliverymans', DeliverymanController.store);
routes.put('/deliverymans/:id', DeliverymanController.update);
routes.delete('/deliverymans/:id', DeliverymanController.delete);

routes.get('/orders', OrderController.index);

routes.post('/avatars', uploadAvatar.single('file'), AvatarController.store);

export default routes;
