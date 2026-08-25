import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {productsRoutes} from './routes/produto.routes'; 

// Tipagem pra adicionar userId no Request
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/products', productsRoutes);

// "Banco de dados" em memória
let users: any[] = [];
let products: any[] = [];

// Cria usuário admin automático
async function createAdmin() {
  if (users.find(u => u.email === 'admin@raizes.com')) {
    console.log('⚠️ Usuário admin já existe');
    return;
  }
  
  const hashedPassword = await bcrypt.hash('123456', 8);
  users.push({
    id: '1',
    name: 'Admin Raizes',
    email: 'admin@raizes.com',
    password: hashedPassword
  });
  console.log('✅ Usuário admin@raizes.com criado automaticamente');
}

// Middleware de autenticação
function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const [, token] = authHeader.split(' ');
  
  try {
    const decoded = jwt.verify(token, 'secreto-raizes') as { id: string };
    req.userId = decoded.id;
    return next();
  } catch {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

// ROTA: Registrar usuário
app.post('/register', async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  if (users.find(user => user.email === email)) {
    return res.status(400).json({ error: 'E-mail já cadastrado' });
  }

  const hashedPassword = await bcrypt.hash(password, 8);
  
  const user = {
    id: String(Date.now()),
    name,
    email,
    password: hashedPassword
  };

  users.push(user);
  console.log('Usuário cadastrado:', email);

  return res.status(201).json({ id: user.id, name, email });
});

// ROTA: Login
app.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  const user = users.find(u => u.email === email);
  
  if (!user) {
    console.log('Login falhou: usuário não encontrado ->', email);
    return res.status(401).json({ error: 'Email ou senha inválidos' });
  }
  
  const passwordMatch = await bcrypt.compare(password, user.password);
  
  if (!passwordMatch) {
    console.log('Login falhou: senha incorreta ->', email);
    return res.status(401).json({ error: 'Email ou senha inválidos' });
  }
  
  const token = jwt.sign({ id: user.id }, 'secreto-raizes', {
    expiresIn: '1d'
  });
  
  console.log('Login realizado com sucesso:', email);
  return res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    },
    token
  });
});

// ROTA: Cadastrar produto
app.post('/products', authMiddleware, (req: Request, res: Response) => {
  const { name, price } = req.body;
  
  if (!name || !price) {
    return res.status(400).json({ error: 'Nome e preço são obrigatórios' });
  }

  const product = {
    id: String(Date.now()),
    name,
    price: Number(price),
    userId: req.userId,
    createdAt: new Date()
  };

  products.push(product);
  console.log('Produto criado:', product.name, 'por user', req.userId);
  
  return res.status(201).json(product);
});

// ROTA: Listar produtos do usuário logado
app.get('/products', authMiddleware, (req: Request, res: Response) => {
  const userProducts = products.filter(p => p.userId === req.userId);
  return res.json(userProducts);
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  createAdmin();
});