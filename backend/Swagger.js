import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'RIVETO API Documentation',
      version: '1.0.0',
      description: 'Interactive API documentation for the RIVETO backend.',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },

  // MAINTAINER REQUIREMENT: Auto-discover docs from the route files
  apis: ['./routes/*.js'], 

 
  apis: ['./routes/*.js'], // Auto-discover docs from route files, // Keep this empty now since we defined paths directly above!

  apis: [], // Keep this empty now since we defined paths directly above!

 
};

const specs = swaggerJsdoc(options);
export default specs;