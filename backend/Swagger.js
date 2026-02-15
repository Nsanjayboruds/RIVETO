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
        url: 'http://localhost:5000',
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
    // --- DOCUMENTATION DEFINED HERE TO PREVENT INDENTATION ERRORS ---
    paths: {
      '/api/auth/registration': {
        post: {
          summary: 'Register a new user',
          tags: ['Auth'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string', example: 'John Doe' },
                    email: { type: 'string', example: 'john@example.com' },
                    password: { type: 'string', example: 'StrongPass123!' }
                  }
                }
              }
            }
          },
          responses: {
            201: { description: 'User registered successfully' }
          }
        }
      },
      '/api/auth/login': {
        post: {
          summary: 'Login a user',
          tags: ['Auth'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    email: { type: 'string', example: 'john@example.com' },
                    password: { type: 'string', example: 'StrongPass123!' }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'User logged in successfully' }
          }
        }
      }
    }
  },
  // We turn off file scanning so it doesn't look for broken comments
  apis: [], 
};

const specs = swaggerJsdoc(options);
export default specs;