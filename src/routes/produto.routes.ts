import { Router } from 'express';
import { ProdutoController } from '../controllers/ProdutoController';

const produtoRoutes = Router();
const produtoController = new ProdutoController();

produtoRoutes.post('/produtos', produtoController.criar);
produtoRoutes.get('/produtos', produtoController.listar);
produtoRoutes.get('/produtos/:id', produtoController.buscarPorId);
produtoRoutes.put('/produtos/:id', produtoController.atualizar);
produtoRoutes.delete('/produtos/:id', produtoController.deletar);

export { produtoRoutes };