import { Request, Response } from 'express';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { email, senha } = req.body;
      console.log('Tentando login com:', email); // LOG PRA VER SE CHEGOU

      const user = await prisma.usuario.findUnique({ where: { email } });
      console.log('Achou user:', user); // LOG PRA VER SE ACHOU

      if (!user) {
        return res.status(400).json({ error: 'Email ou senha incorretos' });
      }

      const senhaCorreta = await compare(senha, user.senha);
      console.log('Senha bateu?', senhaCorreta); // LOG PRA VER SE BATEU

      if (!senhaCorreta) {
        return res.status(400).json({ error: 'Email ou senha incorretos' });
      }

      const token = sign({}, 'seu-secret-jwt-aqui', {
        subject: String(user.id),
        expiresIn: '1d',
      });

      return res.json({ token, user: { id: user.id, nome: user.nome, email: user.email } });

    } catch (error) {
      console.log('ERRO NO LOGIN:', error); // LOG DO ERRO REAL
      return res.status(500).json({ error: 'Erro interno' });
    }
  }
}