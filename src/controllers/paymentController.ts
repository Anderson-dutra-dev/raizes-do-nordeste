import { prisma } from '../lib/prisma'

export async function mockPayment(req, res) {
  const { orderId, metodo } = req.body // metodo: PIX, CARTAO
  const approved = Math.random() > 0.2 // 80% aprova - regra do mock

  const payment = await prisma.payment.create({
    data: {
      orderId,
      metodo,
      valor: (await prisma.order.findUnique({ where: { id: orderId } })).total,
      status: approved ? 'APROVADO' : 'RECUSADO',
      transactionId: `MOCK_${Date.now()}`
    }
  })

  if (approved) {
    await prisma.order.update({ where: { id: orderId }, data: { status: 'PAGO' } })
  }

  return res.json({ message: approved ? 'Pagamento aprovado' : 'Pagamento recusado', payment })
}