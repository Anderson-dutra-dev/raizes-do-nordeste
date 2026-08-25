import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const senhaHash = await hash('123456', 8)

  const admin = await prisma.usuario.upsert({
    where: { email: 'admin@raizes.com' },
    update: {},
    create: {
      nome: 'Admin Raizes',
      email: 'admin@raizes.com',
      senha: senhaHash,
      tipo: 'ADMIN'  // TEU CAMPO CHAMA 'tipo' NÃO 'role'
    }
  })

  console.log('Usuário admin criado 🔥', admin)
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect())