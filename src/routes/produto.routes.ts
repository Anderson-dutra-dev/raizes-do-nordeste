import { Router } from 'express'
import { prisma } from '../lib/prisma'

const router = Router()

router.get('/', async (req, res) => {
  const produtos = await prisma.product.findMany()
  res.json(produtos)
})

router.post('/', async (req, res) => {
  const { name, description, price } = req.body
  const produto = await prisma.product.create({
    data: { name, description, price }
  })
  res.status(201).json(produto)
})

export default router