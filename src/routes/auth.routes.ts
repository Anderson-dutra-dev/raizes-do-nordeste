import { Router } from 'express'
import { prisma } from '../lib/prisma'
import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'

const router = Router()

router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body

    const usuario = await prisma.usuario.findUnique({
      where: { email }
    })

    if (!usuario) {
      return res.status(400).json({ error: 'Usuário não encontrado' })
    }

    const senhaCorreta = await compare(senha, usuario.senha)

    if (!senhaCorreta) {
      return res.status(400).json({ error: 'Senha incorreta' })
    }

    const token = sign(
      { id: usuario.id, role: usuario.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' }
    )

    return res.json({
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role
      }
    })
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno' })
  }
})

export default router