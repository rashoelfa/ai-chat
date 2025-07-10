import 'dotenv/config'
import fastify from 'fastify'
import { mkdir } from 'fs'
import path from 'path'
import { registerRoutes } from './routes'

// ------------------------
// Configuration
// ------------------------
const server = fastify({ logger: true })
const port = Number(process.env.PORT) || 3000
const host = '0.0.0.0'

// ------------------------
// Plugin Registration
// ------------------------
server.register(import('@fastify/cors'), { origin: true })
server.register(import('@fastify/static'), {
  root: path.join(__dirname, 'public'),
  prefix: '/',
})

// ------------------------
// Global Hooks & Handlers
// ------------------------
server.setErrorHandler((error, request, reply) => {
  console.error('Unhandled Error:', error)
  reply.status(500).send({ error: 'Something went wrong!' })
})

// ------------------------
// Routes
// ------------------------

// Health check
server.get('/health', async () => ({ status: 'OK' }))

// Register API routes
registerRoutes(server)

// ------------------------
// Start Server
// ------------------------
const start = async () => {
  try {
    await server.listen({ port, host }, (err, address) => {
      if (err) {
        server.log.error(err)
        process.exit(1)
      }
      console.log(`🚀 Server running at ${address}:${port}`)
    })
    mkdir(path.join(__dirname, 'public'), { recursive: true }, err => {
      if (err) {
        console.error('Failed to create public directory:', err)
      }
    })
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

// ------------------------
// Graceful Shutdown
// ------------------------
const shutdown = async () => {
  console.log('🛑 SIGTERM received. Closing server...')
  await server.close()
  console.log('✅ Server closed')
  process.exit(0)
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)

start()
