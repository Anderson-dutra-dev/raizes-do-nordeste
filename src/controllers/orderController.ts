import { prisma } from '../lib/prisma'
import { auditLog } from '../middlewares/audit'

export async function createOrder(req, res) {
  const { franchiseId, canal, items } = req.body // items: [{productId, quantidade}]
  const userId = req.user.id

  try {
    let total = 0
    // 1. Valida estoque por franquia
    for (const item of items) {
      const stock = await prisma.stock.findUnique({
        where: { productId_franchiseId: { productId: item.productId, franchiseId } }
      })
      if (!stock || stock.quantidade < item.quantidade) {
        return res.status(400).json({ error: `Estoque insuficiente na franquia para produto ${item.productId}` })
      }
      const product = await prisma.product.findUnique({ where: { id: item.productId } })
      total += Number(product.preco) * item.quantidade
    }

    // 2. Cria pedido + baixa estoque em transação
    const order = await prisma.$transaction(async (tx) => {
      const o = await tx.order.create({
        data: {
          userId, franchiseId, canal, total,
          items: { create: items.map((i:any) => ({ productId: i.productId, quantidade: i.quantidade, precoUnit: 0 })) }
        }
      })
      for (const item of items) {
        await tx.stock.update({
          where: { productId_franchiseId: { productId: item.productId, franchiseId } },
          data: { quantidade: { decrement: item.quantidade } }
        })
      }
      // 3. Fidelidade: 1 ponto a cada R$10
      const pontos = Math.floor(total / 10)
      await tx.loyaltyAccount.upsert({
        where: { userId },
        update: { pontos: { increment: pontos } },
        create: { userId, pontos }
      })
      return o
    })

    await auditLog(userId, 'CREATE_ORDER', 'Order', order.id, { total, canal }, req.ip)
    return res.status(201).json(order)

  } catch (e) {
    return res.status(500).json({ error: 'Erro ao criar pedido', details: e.message })
  }
}