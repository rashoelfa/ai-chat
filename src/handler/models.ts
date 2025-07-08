import { FastifyReply, FastifyRequest } from 'fastify'
import { ollama } from '../services/ollama'

export const getModels = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const listResponse = await ollama.list()
    return {
      models: listResponse.models.map(model => ({
        name: model.name,
      })),
    }
  } catch (err) {
    console.error('Failed to fetch models:', err)
    reply.status(500).send({ error: 'Failed to fetch models' })
  }
}
