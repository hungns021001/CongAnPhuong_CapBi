const swaggerAutogen = require('swagger-autogen')()

const outputFile = './libs/Swagger/rule.json'
const endpointsFiles = ['./index.js']

swaggerAutogen(outputFile, endpointsFiles)