# Raízes do Nordeste - Rede de Franquias | API Back-end

## 1. Análise do Problema e Requisitos
A Rede Raízes do Nordeste é uma rede de franquias com unidades em Porto Alegre, Recife e Salvador. O problema é a falta de controle centralizado de estoque distribuído e vendas multicanal (loja física, e-commerce, WhatsApp).
Requisitos atendidos:
- Multicanalidade: API única atendendo todos os canais
- Franquias: estoque controlado por unidade/franquia
- Fidelidade: programa de pontos para clientes recorrentes
- Pagamento Integrado: gateway mockado para simulação
- LGPD e Auditoria

## 2. Modelagem e Arquitetura de Back-end
Arquitetura em camadas: Routes -> Controllers -> Services -> Prisma ORM -> SQLite

Entidades do Domínio:
- Produto (id, nome, preço, categoria)
- UnidadeFranquia (id, cidade, estado)
- Estoque (produtoId, unidadeId, quantidade) - representa estoque distribuído
- Cliente (id, nome, cpf anonimizado, email)
- Pedido (id, clienteId, unidadeId, total, status)
- Fidelidade (clienteId, pontos)
- Usuario (id, email, perfil: ADMIN/GERENTE/VENDEDOR)
- LogAuditoria (acao, usuarioId, data)

Diagrama de caso de uso: Cliente faz pedido -> Sistema verifica estoque da unidade -> Gera pontos fidelidade -> Processa pagamento mock -> Registra log de auditoria.

## 3. Implementação da API e Regras de Negócio
Base: Node.js, Express, TypeScript, Prisma, SQLite, Swagger

Rotas Principais:
- GET /produtos - lista com filtro por unidade
- POST /produtos - cria produto
- POST /pedidos - **Regra:** verifica se `Estoque.quantidade >= pedido.quantidade` na unidade, se não, retorna 400 Estoque insuficiente
- POST /pedidos/pagamento - **Regra:** pagamento mock sempre retorna { status: 'aprovado', transacaoId: uuid }
- POST /fidelidade/adicionar - **Regra:** 1 ponto a cada R$10,00 do pedido
- GET /estoque/:unidadeId - estoque por unidade

## 4. Segurança, LGPD, Logs e Auditoria
- Autenticação: JWT previsto no middleware `authMiddleware` (ver src/middlewares/auth.ts)
- Autorização: perfis ADMIN, GERENTE, VENDEDOR com controle de rota
- LGPD: CPF anonimizado, rota DELETE /clientes/:id para direito ao esquecimento, dados sensíveis não retornados no GET
- Logs Estruturados: Morgan + Winston para logs de requisições
- Auditoria: tabela LogAuditoria registra toda criação/atualização de pedidos e produtos com usuarioId e timestamp

## 5. Plano de Testes (API)
Testes manuais via Swagger e Postman. Coleção em `postman_collection.json`

| # | Cenário | Método | Entrada | Saída Esperada |
|---|---------|--------|---------|----------------|
| 1 | Criar produto válido | POST /produtos | {nome, preco} | 201 Created |
| 2 | Criar produto sem nome (negativo) | POST /produtos | {} | 400 Bad Request |
| 3 | Listar produtos por unidade | GET /produtos?unidade=POA | - | 200 + array filtrado |
| 4 | Pedido com estoque insuficiente (negativo) | POST /pedidos | qtd > estoque | 400 Estoque insuficiente |
| 5 | Pedido válido gera fidelidade | POST /pedidos | total R$100 | 201 + 10 pontos |
| 6 | Pagamento mock | POST /pedidos/pagamento | - | 200 aprovado |

Evidências: Prints em /docs e execução via Postman.

## 6. Entrega Técnica e Documentação
- GitHub: https://github.com/Anderson-dutra-dev/raizes-do-nordeste
- Como rodar:
cp .env.example .env
```bash
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
# Swagger: http://localhost:3000/docs