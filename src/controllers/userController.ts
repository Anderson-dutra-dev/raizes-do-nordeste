import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { hash } from 'bcryptjs';

export class UserController {
  async create(req: Request, res: Response) {
    const { email, password, name } = req.body;

    const userExists = await prisma.user.findUnique({ where: { email } });

    if (userExists) {
      return res.status(400).json({ error: 'Usuário já existe' });
    }

    const passwordHash = await hash(password, 8);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: passwordHash,
        role: 'user' // default do schema
      },
    });

    return res.status(201).json({
      id: user.id,
      email: user.email,
      name: user.name,
    });
  }
}