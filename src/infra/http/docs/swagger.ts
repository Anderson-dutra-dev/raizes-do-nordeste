export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Raízes Nordeste API',
    version: '1.0.0'
  },
  paths: {
    '/': {
      get: {
        summary: 'API Online',
        responses: { '200': { description: 'OK' } }
      }
    }
  }
}