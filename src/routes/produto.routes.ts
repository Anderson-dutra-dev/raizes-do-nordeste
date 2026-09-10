import { Router } from 'express'
import { prisma } from '../lib/prisma'

const router = Router()

// LISTAR
router.get('/', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { criadoEm: 'desc' }
    })
    res.json(products)
  } catch (error) {
    console.error("ERRO NO GET:", error)
    res.status(500).json({ error: String(error) })
  }
})

// CRIAR
router.post('/', async (req, res) => {
  try {
    const { nome, descricao, preco, sku, imagemUrl } = req.body
    if (!nome || preco == null) return res.status(400).json({ error: "nome e preco obrigatórios" })
    
    const novo = await prisma.product.create({
      data: {
        nome,
        descricao: descricao || null,
        preco: parseFloat(preco),
        sku: sku || null,
        imagemUrl: imagemUrl || null
      }
    })
    return res.status(201).json(novo)
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: `SKU já existe: ${error.meta?.target}` })
    }
    console.error("ERRO NO POST:", error)
    return res.status(400).json({ error: String(error) })
  }
})

// EDITAR - PUT /produtos/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { nome, descricao, preco, sku, imagemUrl } = req.body

    const atualizado = await prisma.product.update({
      where: { id },
      data: {
        ...(nome && { nome }),
        ...(descricao !== undefined && { descricao }),
        ...(preco !== undefined && { preco: parseFloat(preco) }),
        ...(sku !== undefined && { sku }),
        ...(imagemUrl !== undefined && { imagemUrl }),
      }
    })
    res.json(atualizado)
  } catch (error) {
    console.error("ERRO NO PUT:", error)
    res.status(400).json({ error: String(error) })
  }
})

// DELETAR - DELETE /produtos/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    await prisma.product.delete({ where: { id } })
    res.status(204).send()
  } catch (error) {
    console.error("ERRO NO DELETE:", error)
    res.status(400).json({ error: String(error) })
  }
})

export default router