import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0', 
    info: {
      title: 'API da SpaceX',
      version: '1.0.0', 
      description: 'Documentação da API da SpaceX',
    },
  },
  apis: ['./dist/api/*.js'], 
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
