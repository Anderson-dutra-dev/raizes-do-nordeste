import { prisma } from '../lib/prisma'
export async function auditLog(userId: string | null, acao: string, entidade: string, entidadeId?: string, dados?: any, ip?: string) {
  await prisma.auditLog.create({
    data: { userId, acao, entidade, entidadeId, dados, ip }
  })
  console.log(`[AUDIT] ${acao} - ${entidade} - User:${userId}`) // Log estruturado
}