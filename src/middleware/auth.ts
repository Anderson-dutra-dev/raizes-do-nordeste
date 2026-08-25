import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export function auth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header) return res.status(401).json({ error: 'Token não fornecido - LGPD: acesso não auditado' })
  
  const [, token] = header.split(' ')
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'raizes_secret')
    // @ts-ignore
    req.user = decoded
    next()
  } catch {
    return res.status(401).json({ error: 'Token inválido' })
  }
}

export function isAdmin(req: Request, res: Response, next: NextFunction) {
  // @ts-ignore
  if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Acesso restrito a ADMIN' })
  next()
}