import { Router } from 'express';
import { ContaController } from './controller/ContaController';

const routes = Router();
const contaController = new ContaController();

routes.get('/contas', contaController.listar);
routes.get('/contas/:id', contaController.buscar);
routes.post('/contas/:id/saque', contaController.sacar);
routes.post('/transferencia', contaController.transferir);

export default routes;