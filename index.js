import Fastify from 'fastify'
import app from './src/app.js'

const fastify = Fastify()

fastify.register(app)

fastify.listen({ port: 3000, host: '0.0.0.0' }, err => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  console.log('Server listening on http://0.0.0.0:3000')
})

