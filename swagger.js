const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger_output.json'
const endpointsFiles = ['./src/routes/worker.route.js', './src/routes/service.route.js', './src/routes/shop.route.js', './src/routes/category.route.js']

swaggerAutogen(outputFile, endpointsFiles)