import swaggerJSDoc from 'swagger-jsdoc'

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Raízes do Nordeste - Rede de Franquias',
      version: '1.0.0',
      description: 'API com multicanalidade, estoque distribuido, pagamento simulado e fidelidade - Projeto UNINTER'
    },
    servers: [{ url: 'http://localhost:3000' }],
    paths: {
      '/produtos': {
        get: {
          summary: 'Listar produtos',
          tags: ['Produtos'],
          responses: { '200': { description: 'Lista de produtos' } }
        },
        post: {
          summary: 'Criar produto',
          tags: ['Produtos'],
          responses: { '201': { description: 'Criado' } }
        }
      },
      '/': {
        get: {
          summary: 'Health check',
          tags: ['Sistema'],
          responses: { '200': { description: 'OK' } }
        }
      }
    }
  },
  apis: []
})