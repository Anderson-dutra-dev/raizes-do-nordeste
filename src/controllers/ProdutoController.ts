import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ProdutoController {
  async criar(req: Request, res: Response) {
    try {
      const { nome, descricao, preco, estoque, imagemUrl } = req.body;
      
      const produto = await prisma.produto.create({
        data: { 
          nome, 
          descricao, 
          preco: Number(preco), 
          estoque: Number(estoque),
          imagemUrl 
        }
      });

      return res.status(201).json(produto);
    } catch (error) {
      console.log('ERRO AO CRIAR PRODUTO:', error);
      return res.status(500).json({ error: 'Erro ao criar produto' });
    }
  }

  async listar(req: Request, res: Response) {
    const produtos = await prisma.produto.findMany();
    return res.json(produtos);
  }

  async buscarPorId(req: Request, res: Response) {
    const { id } = req.params;
    const produto = await prisma.produto.findUnique({ 
      where: { id: Number(id) } 
    });

    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    return res.json(produto);
  }

  async atualizar(req: Request, res: Response) {
    const { id } = req.params;
    const { nome, descricao, preco, estoque, imagemUrl } = req.body;

    try {
      const produto = await prisma.produto.update({
        where: { id: Number(id) },
        data: { 
          nome, 
          descricao, 
          preco: Number(preco), 
          estoque: Number(estoque),
          imagemUrl 
        }
      });
      return res.json(produto);
    } catch (error) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
  }

  async deletar(req: Request, res: Response) {
    const { id } = req.params;
    
    try {
      await prisma.produto.delete({ where: { id: Number(id) } });
      return res.status(204).send();
    } catch (error) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
  }
}