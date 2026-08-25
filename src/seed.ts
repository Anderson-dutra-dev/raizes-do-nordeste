import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const senhaHash = await bcrypt.hash('123456', 8)
  
  await prisma.usuario.upsert({
    where: { email: 'admin@raizes.com' },
    update: { senha: senhaHash },
    create: {
      nome: 'Admin',
      email: 'admin@raizes.com',
      senha: senhaHash,
      tipo: 'ADMIN'
    }
  })
  
  console.log('Admin criado/atualizado: admin@raizes.com / 123456')
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())