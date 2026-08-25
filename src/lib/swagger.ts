import swaggerJSDoc from 'swagger-jsdoc'

export const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Raízes do Nordeste - Rede de Franquias',
      version: '1.0.0',
      description: 'API com multicanalidade, estoque distribuído, pagamento mock e fidelidade - Projeto UNINTER',
    },
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
      }
    }
  },
  apis: ['./src/routes/*.ts'],
}

export const swaggerSpec = swaggerJSDoc(swaggerOptions)