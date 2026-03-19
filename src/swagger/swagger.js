const swaggerAutogen = require('swagger-autogen')({openapi: '3.0.0'});

const doc = {
  info: {
    version: '1',
    title: 'sysfind',
    description: 'sysfind'
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: '127.0.0.1'
    },
  ],
  tags: [
    {
      name: 'Authentication',
      description: 'Authentication related endpoints'
    },

  ],
  components: {
    schemas: {
    }, securitySchemas: {
        cookie: {
          type: 'apiKey',
          in: 'header',
          name: 'LOGIN-COOKIE'
        }
    }
  }            
};

const outputFile = './swagger.json';
const routes = ['../index.js'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);