import { Router } from 'express'

export const routes = Router()

routes.post('/sessions', (req, res) => {
  console.log('Login!', req.body)
  
  return res.status(200).json({
    id: '1', // SEM O 'user'
    name: 'João',
    email: req.body.email,
    token: 'fake-token-123-jwt'
  })
})

routes.get('/me', (req, res) => {
  // SEM O 'user' TAMBÉM
  return res.status(200).json({
    id: '1',
    name: 'João',
    email: 'joao@raizesnordeste.com'
  })
})