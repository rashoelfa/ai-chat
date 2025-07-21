import { FastifyReply, FastifyRequest } from 'fastify'
import { client } from '../services/openai'

export const getModels = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const listResponse = await client.models.list()

    return {
      models: listResponse.data
        .filter((model: any) =>
          Object.values(model.pricing).every(v => v === '0')
        )
        .map((model: any) => ({
          name: model.id,
        })),
    }
  } catch (err) {
    console.error('Failed to fetch models:', err)
    reply.status(500).send({ error: 'Failed to fetch models' })
  }
}
