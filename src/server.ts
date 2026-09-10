import 'dotenv/config' 
import express from 'express'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './lib/swagger'

import produtoRoutes from './routes/produto.routes'
import authRoutes from './routes/auth.routes'
import estoqueRoutes from './routes/estoque.routes'

const app = express()

app.use(cors({ origin: '*' }))
app.use(express.json())

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use('/produtos', produtoRoutes)
app.use('/auth', authRoutes)
app.use('/estoque', estoqueRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'API Raízes do Nordeste ON' })
})

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
  console.log(`Swagger em http://localhost:${PORT}/docs`)
})