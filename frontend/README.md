# Raízes do Nordeste - Rede de Franquias

API Back-end - UNINTER - Sistema para gestão de franquias com estoque distribuído, multicanalidade, pagamento e fidelidade.

## 1. Problema
Centralizar operações de franquias em Recife, Salvador, Fortaleza, com vendas por loja_fisica, ecommerce e whatsapp.

## 2. Arquitetura
Camadas: Controller -> Prisma -> PostgreSQL
Entidades: User, Franchise, Product, Stock (productId + franchiseId unique), Order, OrderItem, Payment, LoyaltyAccount, LoyaltyTransaction, AuditLog

## 3. Regras
- Estoque validado por franquia
- Baixa atômica em transação
- Fidelidade: 1 ponto a cada R$10
- Pagamento mock: 80% aprovado
- Perfis: ADMIN e CUSTOMER com JWT

## 4. Segurança e LGPD
JWT, bcrypt, campo lgpdConsent, CPF não retornado em listagens, AuditLog com ip e userId, logs no console.

## 5. Como Rodar
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
API: http://localhost:3000
Docs: http://localhost:3000/docs

## 6. Entrega
GitHub + README + Swagger + Postman Collection