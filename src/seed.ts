import { prisma } from './lib/prisma'
import bcrypt from 'bcryptjs'

async function main() {
  console.log('Limpando...')
  await prisma.orderItem.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.order.deleteMany()
  await prisma.stock.deleteMany()
  await prisma.product.deleteMany()
  await prisma.user.deleteMany()

  const senha = await bcrypt.hash('123456', 10)

  const admin = await prisma.user.create({
    data: {
      nome: 'Admin Raizes',
      email: 'admin@raizes.com',
      senha,
      role: 'ADMIN'
    }
  })

  const cliente = await prisma.user.create({
    data: {
      nome: 'Cliente Teste',
      email: 'cliente@raizes.com',
      senha,
      role: 'CUSTOMER'
    }
  })

  const produtos = await Promise.all([
    prisma.product.create({ data: { nome: 'Castanha de Caju', descricao: 'Premium 500g', preco: 45.9, sku: 'CAST-001' } }),
    prisma.product.create({ data: { nome: 'Cajuína São Geraldo', descricao: 'Garrafa 1L', preco: 12.5, sku: 'CAJU-002' } }),
    prisma.product.create({ data: { nome: 'Rapadura', descricao: 'Rapadura tradicional', preco: 8.0, sku: 'RAPA-003' } }),
    prisma.product.create({ data: { nome: 'Queijo Coalho', descricao: 'Queijo coalho 500g', preco: 28.0, sku: 'QUEI-004' } }),
    prisma.product.create({ data: { nome: 'Doce de Leite', descricao: 'Doce de leite 400g', preco: 18.5, sku: 'DOCE-005' } }),
  ])

  for (const p of produtos) {
    await prisma.stock.createMany({
      data: [
        { productId: p.id, quantidade: 20, unidade: 'FORTALEZA-CE' },
        { productId: p.id, quantidade: 15, unidade: 'RECIFE-PE' },
        { productId: p.id, quantidade: 10, unidade: 'SALVADOR-BA' },
      ]
    })
  }

  console.log('Seed feito! Admin: admin@raizes.com / 123456')
}

main()