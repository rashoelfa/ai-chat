import { FastifyInstance } from 'fastify'
import { chat } from './handler/chat'
import { getModels } from './handler/models'
import { validateBody } from './middleware/validateBody'
import { chatRequestSchema } from './validation/chat'

declare module 'fastify' {
  interface FastifyRequest {
    validatedBody?: any
  }
}

export const registerRoutes = async (server: FastifyInstance) => {
  // Get available models
  server.get('/models', getModels)

  // Chat
  server.post('/chat', { preHandler: validateBody(chatRequestSchema) }, chat)
}
