import { Router } from 'express'
import { ensureAuth } from '../middleware/ensureAuth'
import { prisma } from '../server'

const router = Router()

router.get('/', ensureAuth, async (req, res) => {
  const produtos = await prisma.produto.findMany({
    select: { id: true, nome: true, sku: true, estoque: true },
    orderBy: { nome: 'asc' }
  })
  return res.json(produtos)
})

router.post('/movimentar', ensureAuth, async (req, res) => {
  const { produtoId, tipo, quantidade, motivo } = req.body

  if (!produtoId || !tipo || !quantidade) {
    return res.status(400).json({ error: 'produtoId, tipo e quantidade são obrigatórios' })
  }

  if (!['ENTRADA', 'SAIDA'].includes(tipo)) {
    return res.status(400).json({ error: 'Tipo deve ser ENTRADA ou SAIDA' })
  }

  if (Number(quantidade) <= 0) {
    return res.status(400).json({ error: 'Quantidade deve ser maior que zero' })
  }

  const produto = await prisma.produto.findUnique({ where: { id: produtoId } })
  if (!produto) return res.status(404).json({ error: 'Produto não encontrado' })

  const qtd = Number(quantidade)
  let novoEstoque = produto.estoque

  if (tipo === 'ENTRADA') {
    novoEstoque += qtd
  } else {
    if (produto.estoque < qtd) {
      return res.status(400).json({ error: 'Estoque insuficiente' })
    }
    novoEstoque -= qtd
  }

  const [produtoAtualizado, movimentacao] = await prisma.$transaction([
    prisma.produto.update({
      where: { id: produtoId },
      data: { estoque: novoEstoque }
    }),
    prisma.movimentacao.create({
      data: {
        tipo,
        quantidade: qtd,
        motivo: motivo || null,
        produtoId,
        usuarioId: req.user.id
      }
    })
  ])

  return res.json({ produto: produtoAtualizado, movimentacao })
})

router.put('/ajustar/:id', ensureAuth, async (req, res) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Sem permissão' })
  }

  const { id } = req.params
  const { quantidade, motivo } = req.body

  if (quantidade === undefined) {
    return res.status(400).json({ error: 'Quantidade é obrigatória' })
  }

  const produto = await prisma.produto.findUnique({ where: { id } })
  if (!produto) return res.status(404).json({ error: 'Produto não encontrado' })

  const estoqueAnterior = produto.estoque
  const novoEstoque = Number(quantidade)

  const [produtoAtualizado] = await prisma.$transaction([
    prisma.produto.update({
      where: { id },
      data: { estoque: novoEstoque }
    }),
    prisma.movimentacao.create({
      data: {
        tipo: 'AJUSTE',
        quantidade: Math.abs(novoEstoque - estoqueAnterior),
        motivo: motivo || `Ajuste de ${estoqueAnterior} para ${novoEstoque}`,
        produtoId: id,
        usuarioId: req.user.id
      }
    })
  ])

  return res.json(produtoAtualizado)
})

router.get('/historico/:produtoId', ensureAuth, async (req, res) => {
  const { produtoId } = req.params

  const historico = await prisma.movimentacao.findMany({
    where: { produtoId },
    include: { usuario: { select: { nome: true } } },
    orderBy: { createdAt: 'desc' },
    take: 50
  })

  return res.json(historico)
})

export default router // 