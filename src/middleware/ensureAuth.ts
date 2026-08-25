import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'

interface TokenPayload {
  id: string
  role: string
  iat: number
  exp: number
}

export function ensureAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido' })
  }

  const [, token] = authHeader.split(' ')

  try {
    const decoded = verify(token, process.env.JWT_SECRET as string)
    const { id, role } = decoded as TokenPayload
    
    req.user = { id, role }
    
    return next()
  } catch {
    return res.status(401).json({ error: 'Token inválido' })
  }
}