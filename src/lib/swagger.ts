import swaggerJSDoc from 'swagger-jsdoc'

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Raízes do Nordeste',
      version: '1.0.0',
      description: 'CRUD de produtos'
    },
    tags: [{ name: 'Produtos' }],
    paths: {
      '/produtos': {
        get: {
          summary: 'Listar todos os produtos',
          tags: ['Produtos'],
          responses: { 200: { description: 'OK' } }
        },
        post: {
          summary: 'Criar produto',
          tags: ['Produtos'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['nome', 'preco'],
                  properties: {
                    nome: { type: 'string', example: 'Cajuína' },
                    descricao: { type: 'string', example: 'Raiz demais' },
                    preco: { type: 'number', example: 15.5 },
                    sku: { type: 'string', example: 'CAJU-03' },
                    imagemUrl: { type: 'string', example: 'https://...' }
                  }
                }
              }
            }
          },
          responses: { 201: { description: 'Criado' }, 400: { description: 'Erro' } }
        }
      },
      '/produtos/{id}': {
        put: {
          summary: 'Atualizar produto',
          tags: ['Produtos'],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID do produto' }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    nome: { type: 'string', example: 'Cajuína Premium' },
                    descricao: { type: 'string', example: 'Edição especial' },
                    preco: { type: 'number', example: 20.5 },
                    sku: { type: 'string', example: 'CAJU-03-EDIT' },
                    imagemUrl: { type: 'string', example: 'https://...' }
                  }
                }
              }
            }
          },
          responses: { 200: { description: 'Atualizado' }, 400: { description: 'Erro' } }
        },
        delete: {
          summary: 'Deletar produto',
          tags: ['Produtos'],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID do produto' }
          ],
          responses: { 204: { description: 'Deletado' }, 400: { description: 'Erro' } }
        }
      }
    }
  },
  apis: []
})