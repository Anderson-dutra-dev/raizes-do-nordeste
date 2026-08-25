import 'express-async-errors'
import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
import authRoutes from './routes/auth.routes'
import produtoRoutes from './routes/produto.routes'
import estoqueRoutes from './routes/estoque.routes'

const app = express()
export const prisma = new PrismaClient()

// CORS LIBERADO PRA TU LOGAR DO NAVEGADOR
app.use(cors())

app.use(express.json())

// ROTA DE TESTE
app.get('/', (req, res) => {
  return res.json({ message: 'API Raízes Nordeste Online 🔥' })
})

// ROTAS DA API
app.use(authRoutes)
app.use(produtosRoutes)
app.use(estoqueRoutes)

// TRATAMENTO DE ERROS
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof Error) {
    return res.status(400).json({
      error: err.message
    })
  }

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  })
})

app.listen(3333, () => {
  console.log('Servidor rodando na porta 3333 🔥')
})