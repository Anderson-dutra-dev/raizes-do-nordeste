import express from 'express'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './lib/swagger'
import produtoRoutes from './routes/produto.routes'

const app = express()
app.use(cors())
app.use(express.json())

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use('/produtos', produtoRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'API rodando', docs: '/docs' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
export default app