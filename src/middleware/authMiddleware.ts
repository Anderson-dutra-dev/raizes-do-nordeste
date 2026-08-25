import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

interface TokenPayload {
  sub: string;
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const [, token] = authorization.split(' ');

  try {
    const decoded = verify(token, 'seu-secret-jwt-aqui');
    const { sub } = decoded as TokenPayload;

    req.userId = sub;

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}